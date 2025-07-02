import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import React from 'react';

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

  return (
    <div className="p-4 border rounded shadow-sm">
      <h2 className="text-lg font-bold">{book.title}</h2>
      <p className="text-sm text-gray-700 italic mb-2">by {book.author}</p>
      <img
        src={book.book_image}
        alt={book.title}
        onError={handleImgError}
        className="w-32 mb-2"
      />
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
        <h3 className="font-semibold">Average Rating: {ratings?.average?.toFixed(2) || 'N/A'}</h3>
        {token && !userRatingId && (
          <>
            <input
              type="number"
              min="1"
              max="5"
              placeholder="Rate 1-5"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              className="border p-1 w-20 mr-2"
            />
            <button
              onClick={handleRatingSubmit}
              className="text-sm bg-green-500 text-white px-2 py-1 rounded"
            >
              Submit Rating
            </button>
          </>
        )}
        {token && userRatingId && (
          <button
            onClick={handleDeleteRating}
            className="ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete My Rating
          </button>
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
        {token && (
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
        )}
      </div>
    </div>
  );
});

export default BookCard;