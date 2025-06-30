import { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const searchBooks = async () => {
    const res = await axios.get(`http://localhost:5000/api/books/search?q=${query}`);
    setBooks(res.data.results || []);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">NYT Book Search</h1>
      <input
        className="border p-2 mr-2"
        placeholder="Search by title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchBooks} className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>
      <ul className="mt-4">
        {books.map((book, idx) => (
          <li key={idx} className="border-b py-2">
            <p className="font-semibold">{book.book_title}</p>
            <p className="text-sm">{book.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
