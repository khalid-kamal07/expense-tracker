import { useState } from 'react';
import { BarChart3, LayoutDashboard, LogOut, Menu, ReceiptText, X, Plus } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Layout(){
 const [open,setOpen]=useState(false); const {user,logout}=useAuth(); const navigate=useNavigate();
 const links=[['/','Dashboard',LayoutDashboard],['/transactions','Transactions',ReceiptText],['/reports','Reports',BarChart3]];
 const signOut=()=>{logout();navigate('/login')};
 return <div className="app-shell"><aside className={open?'sidebar open':'sidebar'}><div className="side-top"><Logo/><button className="mobile-close" onClick={()=>setOpen(false)}><X/></button></div><nav>{links.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)}><Icon size={19}/><span>{label}</span></NavLink>)}</nav><div className="side-bottom"><div className="user-mini"><div className="avatar">{user?.name?.[0]?.toUpperCase()}</div><div><strong>{user?.name}</strong><span>{user?.email}</span></div></div><button className="logout" onClick={signOut}><LogOut size={18}/> Sign out</button></div></aside><main className="main"><header className="topbar"><button className="mobile-menu" onClick={()=>setOpen(true)}><Menu/></button><div className="top-title"><span className="mobile-brand"><Logo/></span><span className="desktop-greeting">Good day, <b>{user?.name?.split(' ')[0]}</b> 👋</span></div><button className="quick-add" onClick={()=>navigate('/transactions?add=1')}><Plus size={18}/> Add transaction</button></header><div className="content"><Outlet/></div></main></div>
}
