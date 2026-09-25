import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
import morgan from 'morgan';
import 'express-async-errors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';

const app = express();
const port = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_URL?.split(',').map(x => x.trim()) || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Expense Tracker API is running' }));
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use((err, req, res, next) => { console.error(err); res.status(err.status || 500).json({ message: err.message || 'Server error' }); });

connectDB().catch(err => { console.error(err); if (!process.env.VERCEL) process.exit(1); });

if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
}

export default app;
