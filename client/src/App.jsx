import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './components/BookCard.jsx';
import AuthForm from './components/AuthForm.jsx';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return token && userId ? { token, userId } : null;
  });

  const MAX_RESULTS = 10;

  const searchBooks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/search?q=${query}`);
      const foundBooks = res.data.results || [];

      setBooks(foundBooks.slice(0, MAX_RESULTS));
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }
    const t = setTimeout(() => {
      searchBooks();
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

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
    <motion.div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">NYT Book Search</h1>
      <AuthForm onAuth={handleAuth} token={auth?.token} />
      {auth && (
        <button
          onClick={handleLogout}
          className="mb-4 self-start bg-gray-300 px-3 py-1 rounded"
        >
          Logout
        </button>
      )}
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Search by category name (e.g., 'fiction')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={searchBooks}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {books.length === 0 ? (
        <p className="text-gray-500 italic">No results found.</p>
      ) : (
        <AnimatePresence>
          <div className="space-y-6">
            {books.map((book) => (
              <motion.div key={book.primary_isbn13} layout>
                <BookCard
                  book={book}
                  userId={auth?.userId}
                  token={auth?.token}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default App;
