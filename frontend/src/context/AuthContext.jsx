import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem('expense_token')) return setLoading(false);
    api.me().then(r => setUser(r.user)).catch(() => localStorage.removeItem('expense_token')).finally(() => setLoading(false));
  }, []);
  const login = async data => { const r = await api.login(data); localStorage.setItem('expense_token', r.token); setUser(r.user); };
  const register = async data => { const r = await api.register(data); localStorage.setItem('expense_token', r.token); setUser(r.user); };
  const logout = () => { localStorage.removeItem('expense_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
