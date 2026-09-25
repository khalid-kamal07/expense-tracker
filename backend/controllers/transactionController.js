import Transaction from '../models/Transaction.js';

const cleanDate = (date) => {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
};

export async function listTransactions(req, res) {
  const { type, category, from, to, search } = req.query;
  const query = { user: req.user._id };
  if (type && ['income','expense'].includes(type)) query.type = type;
  if (category && category !== 'all') query.category = category;
  if (search?.trim()) query.title = { $regex: search.trim(), $options: 'i' };
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(`${from}T00:00:00`);
    if (to) query.date.$lte = new Date(`${to}T23:59:59.999`);
  }
  const items = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
  res.json({ transactions: items });
}

export async function createTransaction(req, res) {
  const { type, title, amount, category, date, note } = req.body;
  if (!['income','expense'].includes(type) || !title || !category || !date || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Please provide valid transaction details' });
  }
  const parsedDate = cleanDate(date);
  if (!parsedDate) return res.status(400).json({ message: 'Invalid date' });
  const item = await Transaction.create({ user: req.user._id, type, title, amount: Number(amount), category, date: parsedDate, note: note || '' });
  res.status(201).json({ transaction: item });
}

export async function updateTransaction(req, res) {
  const item = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
  if (!item) return res.status(404).json({ message: 'Transaction not found' });
  const { type, title, amount, category, date, note } = req.body;
  if (type && !['income','expense'].includes(type)) return res.status(400).json({ message: 'Invalid type' });
  if (amount !== undefined && Number(amount) <= 0) return res.status(400).json({ message: 'Amount must be greater than zero' });
  Object.assign(item, { type: type ?? item.type, title: title ?? item.title, amount: amount !== undefined ? Number(amount) : item.amount, category: category ?? item.category, date: date ? cleanDate(date) : item.date, note: note ?? item.note });
  if (!item.date) return res.status(400).json({ message: 'Invalid date' });
  await item.save();
  res.json({ transaction: item });
}

export async function deleteTransaction(req, res) {
  const item = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!item) return res.status(404).json({ message: 'Transaction not found' });
  res.json({ message: 'Transaction deleted' });
}

export async function summary(req, res) {
  const user = req.user._id;
  const [totals, byCategory, monthly] = await Promise.all([
    Transaction.aggregate([{ $match: { user } }, { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Transaction.aggregate([{ $match: { user, type: 'expense' } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }]),
    Transaction.aggregate([{ $match: { user } }, { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' } } }, { $sort: { '_id.year': 1, '_id.month': 1 } }])
  ]);
  const income = totals.find(x => x._id === 'income')?.total || 0;
  const expense = totals.find(x => x._id === 'expense')?.total || 0;
  res.json({ income, expense, balance: income - expense, transactionCount: (totals[0]?.count || 0) + (totals[1]?.count || 0), byCategory, monthly });
}
