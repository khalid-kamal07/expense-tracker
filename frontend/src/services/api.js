const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('expense_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
export const api = {
  register: body => request('/auth/register', { method:'POST', body:JSON.stringify(body) }),
  login: body => request('/auth/login', { method:'POST', body:JSON.stringify(body) }),
  me: () => request('/auth/me'),
  transactions: params => request(`/transactions${params ? `?${new URLSearchParams(params)}` : ''}`),
  createTransaction: body => request('/transactions', { method:'POST', body:JSON.stringify(body) }),
  updateTransaction: (id, body) => request(`/transactions/${id}`, { method:'PUT', body:JSON.stringify(body) }),
  deleteTransaction: id => request(`/transactions/${id}`, { method:'DELETE' }),
  summary: () => request('/transactions/summary')
};
