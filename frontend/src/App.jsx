import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';

function Private(){const {user,loading}=useAuth();if(loading)return <div className="loading-screen">Loading Spendly...</div>;return user?<Layout/>:<Navigate to="/login" replace/>}
export default function App(){return <Routes><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route element={<Private/>}><Route path="/" element={<Dashboard/>}/><Route path="/transactions" element={<Transactions/>}/><Route path="/reports" element={<Reports/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
