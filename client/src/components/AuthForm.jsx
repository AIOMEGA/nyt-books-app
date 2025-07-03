import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-6 p-4 bg-gray-800 shadow rounded flex flex-col sm:flex-row sm:items-end gap-2"
    >
      <input
        className="border p-2 rounded flex-1 bg-gray-700 text-gray-100"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 rounded flex-1 bg-gray-700 text-gray-100"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors"
        type="submit"
      >
        {isRegister ? 'Register' : 'Login'}
      </button>
      <button
        type="button"
        onClick={() => setIsRegister(!isRegister)}
        className="underline text-sm"
      >
        {isRegister ? 'Need to Login?' : 'Need to Register?'}
      </button>
    </motion.form>
  );
}