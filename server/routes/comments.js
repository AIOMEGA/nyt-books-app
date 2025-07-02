const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Create a comment
router.post('/', auth, async (req, res) => {
    try {
        const { bookId, text } = req.body;
        const userId = req.userId;
        const comment = new Comment({ bookId, userId, text });
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        console.error('Error creating comment:', err);
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

// Get all comments for a specific book
router.get('/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const comments = await Comment.find({ bookId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Update a comment by ID
router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Comment.findByIdAndUpdate(
            req.params.id,
            { text: req.body.text },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        console.error('Error updating comment:', err);
        res.status(500).json({ error: 'Failed to update comment' });
    }
});

// Delete a comment by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

module.exports = router;
