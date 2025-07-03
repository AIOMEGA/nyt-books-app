import { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryRow from './components/CategoryRow.jsx';
import AuthForm from './components/AuthForm.jsx';
import { motion } from 'framer-motion';

export default function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return token && userId ? { token, userId } : null;
  });

  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('http://localhost:5000/api/books/list-names');
        const cats = res.data.results.slice(0, 10);
        setCategories(cats);
        for (const c of cats) {
          try {
            const r = await axios.get(
              `http://localhost:5000/api/books/current/${c.list_name_encoded}`
            );
            setBooks((prev) => ({
              ...prev,
              [c.list_name_encoded]: r.data.results.books || [],
            }));
          } catch (err) {
            console.error('Failed fetching category', c.list_name_encoded, err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
    fetchData();
  }, []);

  const handleAuth = ({ token, userId }) => {
    const data = { token, userId };
    setAuth(data);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  return (
    <motion.div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">NYT Best Sellers</h1>
      <AuthForm onAuth={handleAuth} token={auth?.token} />
      {auth && (
        <button
          onClick={handleLogout}
          className="mb-4 self-start bg-gray-700 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      )}
      <div className="space-y-12">
        {categories.map((cat) => (
          <CategoryRow
            key={cat.list_name_encoded}
            title={cat.display_name}
            books={books[cat.list_name_encoded] || []}
            userId={auth?.userId}
            token={auth?.token}
          />
        ))}
      </div>
    </motion.div>
  );
}
