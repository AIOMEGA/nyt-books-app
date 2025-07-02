import { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [comments, setComments] = useState({});
  const [ratings, setRatings] = useState({});
  const [newComment, setNewComment] = useState({});
  const [newRating, setNewRating] = useState({});

  const fetchBookData = async (bookId) => {
    try {
      const [commentsRes, ratingsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/comments/${bookId}`),
        axios.get(`http://localhost:5000/api/ratings/${bookId}`),
      ]);
  
      setComments((prev) => ({ ...prev, [bookId]: commentsRes.data }));
      setRatings((prev) => ({ ...prev, [bookId]: ratingsRes.data }));
    } catch (err) {
      console.error(`Error fetching data for ${bookId}:`, err);
    }
  };  

  const searchBooks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/search?q=${query}`);
      const foundBooks = res.data.results || [];
      setBooks(foundBooks);
  
      for (const book of foundBooks) {
        fetchBookData(book.primary_isbn13);
      }
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };  

  const handleCommentSubmit = async (bookId) => {
    if (!newComment[bookId]) return;
    try {
      await axios.post('http://localhost:5000/api/comments', {
        bookId,
        text: newComment[bookId],
      });
      setNewComment({ ...newComment, [bookId]: '' });
      const res = await axios.get(`http://localhost:5000/api/comments/${bookId}`);
      setComments((prev) => ({ ...prev, [bookId]: res.data }));
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const handleRatingSubmit = async (bookId) => {
    const ratingValue = parseInt(newRating[bookId]);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) return;

    try {
      await axios.post('http://localhost:5000/api/ratings', {
        bookId,
        score: ratingValue,
      });
      setNewRating({ ...newRating, [bookId]: '' });
      await fetchBookData(bookId);
    } catch (err) {
      console.error('Failed to post rating:', err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NYT Book Search</h1>
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
        <p className="text-gray-500 italic">No results found.</p>
      ) : (
        <div className="space-y-6">
          {books.map((book, idx) => {
            const bookId = book.primary_isbn13;
            return (
              <div key={idx} className="p-4 border rounded shadow-sm">
                <h2 className="text-lg font-bold">{book.title}</h2>
                <p className="text-sm text-gray-700 italic mb-2">by {book.author}</p>
                <img src={book.book_image} alt={book.title} className="w-32 mb-2" />
                <p className="text-gray-800 mb-2">{book.description}</p>
                <a
                  href={book.amazon_product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Buy on Amazon
                </a>

                <div className="mt-4">
                  <h3 className="font-semibold">Average Rating: {ratings[bookId]?.average?.toFixed(2) || 'N/A'}</h3>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Rate 1-5"
                    value={newRating[bookId] || ''}
                    onChange={(e) => setNewRating({ ...newRating, [bookId]: e.target.value })}
                    className="border p-1 w-20 mr-2"
                  />
                  <button
                    onClick={() => handleRatingSubmit(bookId)}
                    className="text-sm bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Submit Rating
                  </button>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Comments:</h3>
                  <ul className="list-disc ml-5 text-sm text-gray-700">
                    {(comments[bookId] || []).map((comment, i) => (
                      <li key={i}>{comment.text}</li>
                    ))}
                  </ul>
                  <div className="mt-2 flex gap-2">
                    <input
                      placeholder="Add a comment"
                      value={newComment[bookId] || ''}
                      onChange={(e) => setNewComment({ ...newComment, [bookId]: e.target.value })}
                      className="border p-1 flex-1"
                    />
                    <button
                      onClick={() => handleCommentSubmit(bookId)}
                      className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
