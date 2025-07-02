import { useState } from 'react';
import axios from 'axios';

export default function AuthForm({ onAuth, token }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await axios.post(`http://localhost:5000${url}`, { username, password });
      onAuth(res.data);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Auth error:', err);
      alert('Authentication failed');
    }
  };

  if (token) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2 items-end">
      <input
        className="border p-1"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="border p-1"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-2 py-1 rounded" type="submit">
        {isRegister ? 'Register' : 'Login'}
      </button>
      <button
        type="button"
        onClick={() => setIsRegister(!isRegister)}
        className="underline text-sm"
      >
        {isRegister ? 'Need to Login?' : 'Need to Register?'}
      </button>
    </form>
  );
}