import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './components/BookCard.jsx';
import AuthForm from './components/AuthForm.jsx';

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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NYT Book Search</h1>
      <AuthForm onAuth={handleAuth} token={auth?.token} />
      {auth && (
        <button
          onClick={handleLogout}
          className="mb-4 bg-gray-300 px-2 py-1 rounded"
        >
          Logout
        </button>
      )}
      <div className="flex gap-2 mb-4">
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
        <p className="text-gray-500 italic">No results found.</p>) : (
        <div className="space-y-6">
          {books.map((book) => (
            <BookCard
              key={book.primary_isbn13}
              book={book}
              userId={auth?.userId}
              token={auth?.token}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
