import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true, trim: true, maxlength: 40 },
  date: { type: Date, required: true },
  note: { type: String, trim: true, maxlength: 300, default: '' }
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });
export default mongoose.model('Transaction', transactionSchema);
