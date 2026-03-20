import React, { useState } from 'react'; import { useNavigate } from 'react-router-dom'; import { useStore } from '../store/useStore';
export const Home = () => {
  const [isLogin, setIsLogin] = useState(true); const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const login = useStore(state => state.login); const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/auth/${isLogin ? 'login' : 'register'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.message);
      login(data.user, data.token); navigate('/lobby');
    } catch (err: any) { setError(err.message); }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">SHARK</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:ring-2" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:ring-2" required />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Register instead" : "Login instead"}</p>
      </div>
    </div>
  );
};
