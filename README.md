# Spendly — Expense Tracker (MERN)

A complete, responsive expense/income tracker built with React, Vite, Node.js, Express and MongoDB.

## Features
- JWT registration, login and protected routes
- Add, edit and delete income/expense transactions
- Transaction search and type/category filters
- Dashboard with balance, income, expense and transaction statistics
- Monthly income vs expense chart
- Expense category breakdown
- Financial reports and CSV export
- Responsive desktop/mobile UI
- Reusable React components and centralized API service
- MongoDB persistence with user-owned transaction records

## Requirements
- Node.js 18+
- MongoDB local installation or MongoDB Atlas

## 1. Backend
```bash
cd backend
npm install
copy .env.example .env
```
For macOS/Linux use `cp .env.example .env`.

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```
Then:
```bash
npm run dev
```

## 2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```
For macOS/Linux use `cp .env.example .env`.

Open the Vite URL shown in the terminal (normally http://localhost:5173).

## MongoDB Atlas
If using Atlas, replace `MONGO_URI` with your Atlas connection string and allow your development/deployment IP in Atlas Network Access.

## Production build
```bash
cd frontend
npm run build
```
The generated `dist` folder can be deployed to Vercel/Netlify. Deploy the Express backend separately (for example Render/Railway/Fly.io) and set `VITE_API_URL` on the frontend to the deployed backend API URL.

## API overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/transactions/summary`
- `GET /api/health`

All transaction routes require `Authorization: Bearer <JWT>`.
