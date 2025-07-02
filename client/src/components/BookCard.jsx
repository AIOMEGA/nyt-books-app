import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import React from 'react';
import { motion } from 'framer-motion';

const PLACEHOLDER_IMG = 'https://via.placeholder.com/128x193?text=No+Image';

const BookCard = React.memo(function BookCard({ book, userId, token }) {
  const bookId = book.primary_isbn13;

  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState({});
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
const [userRatingId, setUserRatingId] = useState(() => {
    const data = localStorage.getItem('userRatings');
    if (!data) return null;
    const map = JSON.parse(data);
    return map[`${userId}_${bookId}`] || null;
});

// Keep the stored rating id in sync when user or book changes
useEffect(() => {
    const data = localStorage.getItem('userRatings');
    const map = data ? JSON.parse(data) : {};
    setUserRatingId(map[`${userId}_${bookId}`] || null);
}, [userId, bookId]);

useEffect(() => {
    const data = localStorage.getItem('userRatings');
    const map = data ? JSON.parse(data) : {};
    const key = `${userId}_${bookId}`;
    if (userRatingId) {
      map[key] = userRatingId;
    } else {
      delete map[key];
    }
    localStorage.setItem('userRatings', JSON.stringify(map));
}, [userRatingId, bookId, userId]);

  const fetchBookData = useCallback(async () => {
    try {
      const [commentsRes, ratingsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/comments/${bookId}`),
        axios.get(`http://localhost:5000/api/ratings/${bookId}`),
      ]);
      setComments(commentsRes.data);
      setRatings(ratingsRes.data);
    } catch (err) {
      console.error(`Error fetching data for ${bookId}:`, err);
    }
}, [bookId]);

  useEffect(() => {
    fetchBookData();
  }, [fetchBookData]);

  const handleCommentSubmit = useCallback(async () => {
    if (!newComment) return;
    try {
      await axios.post(
        'http://localhost:5000/api/comments',
        { bookId, text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      const res = await axios.get(`http://localhost:5000/api/comments/${bookId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
}, [newComment, bookId, token]);

  const handleEditComment = useCallback(async () => {
    if (!editingCommentId) return;
    try {
      await axios.put(
        `http://localhost:5000/api/comments/${editingCommentId}`,
        { text: editingCommentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      setEditingCommentText('');
      const res = await axios.get(`http://localhost:5000/api/comments/${bookId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
}, [editingCommentId, editingCommentText, bookId, token]);

  const handleDeleteComment = useCallback(async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      const res = await axios.get(`http://localhost:5000/api/comments/${bookId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
}, [bookId, token]);

  const handleRatingSubmit = useCallback(async () => {
    const ratingValue = parseInt(newRating);
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) return;
    try {
      const res = await axios.post(
        'http://localhost:5000/api/ratings',
        { bookId, score: ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserRatingId(res.data._id);
      setNewRating('');
      await fetchBookData();
    } catch (err) {
      console.error('Failed to post rating:', err);
    }
}, [newRating, bookId, fetchBookData, token]);

  const handleDeleteRating = useCallback(async () => {
    if (!userRatingId) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/ratings/${userRatingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserRatingId(null);
      await fetchBookData();
    } catch (err) {
      console.error('Failed to delete rating:', err);
    }
}, [userRatingId, fetchBookData, token]);

  const handleImgError = (e) => {
    e.target.src = PLACEHOLDER_IMG;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i += 1) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${rating >= i ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.393c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.966z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="group p-4 border rounded shadow-sm bg-white flex flex-col sm:flex-row gap-4 transition"
    >
      <img
        src={book.book_image}
        alt={book.title}
        onError={handleImgError}
        className="w-32 h-auto rounded self-center sm:self-start shadow-md transition-transform group-hover:scale-105"
      />
      <div className="flex-1 space-y-2">
        <h2 className="text-lg font-bold">{book.title}</h2>
        <p className="text-sm text-gray-700 italic">by {book.author}</p>
        <p className="text-gray-800">{book.description}</p>
        <a
          href={book.amazon_product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded shadow transition"
        >
          Buy on Amazon
        </a>
        </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1">
          {renderStars(ratings?.average || 0)}
          <span className="ml-2 text-sm text-gray-700">
            {ratings?.average?.toFixed(2) || 'N/A'}
          </span>
        </div>
        {token ? (
          userRatingId ? (
            <button
              onClick={handleDeleteRating}
              className="text-sm bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete My Rating
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="5"
                placeholder="Rate 1-5"
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
                className="border p-1 w-20"
              />
              <button
                onClick={handleRatingSubmit}
                className="text-sm bg-green-500 text-white px-2 py-1 rounded"
              >
                Submit Rating
              </button>
            </div>
          )
        ) : (
          <p className="text-sm text-gray-500">Login to rate this book</p>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Comments:</h3>
        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
          {comments.map((comment) => (
            <li key={comment._id} className="flex items-start gap-2">
              {editingCommentId === comment._id && token && comment.userId === userId ? (
                <>
                  <input
                    className="border p-1 flex-1"
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                  />
                  <button
                    onClick={handleEditComment}
                    className="text-sm bg-green-500 text-white px-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setEditingCommentId(null); setEditingCommentText(''); }}
                    className="text-sm bg-gray-300 px-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1">{comment.text}</span>
                  {token && comment.userId === userId && (
                    <>
                      <button
                        onClick={() => { setEditingCommentId(comment._id); setEditingCommentText(comment.text); }}
                        className="text-xs text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-xs text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
        {token ? (
          <div className="mt-2 flex gap-2">
            <input
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border p-1 flex-1"
            />
            <button
              onClick={handleCommentSubmit}
              className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
            >
              Submit
            </button>
          </div>
          ) : (
            <p className="text-sm text-gray-500">Login to add a comment</p>
        )}
      </div>
      </motion.div>
  );
});

export default BookCard;