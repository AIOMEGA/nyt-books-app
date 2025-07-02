const express = require('express');
const Rating = require('../models/Rating');
const router = express.Router();

// POST a rating or update existing rating for the same user
router.post('/', async (req, res) => {
    const { bookId, score, userId } = req.body;
    try {
        let rating = await Rating.findOne({ bookId, userId });
        if (rating) {
            rating.score = score;
            await rating.save();
            return res.json(rating);
        }
        rating = new Rating({ bookId, userId, score });
        await rating.save();
        res.status(201).json(rating);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save rating' });
    }
});

// GET average rating for a book
router.get('/:bookId', async (req, res) => {
    const { bookId } = req.params;
    try {
        const ratings = await Rating.find({ bookId, score: { $exists: true } });
        const validRatings = ratings.filter(r => typeof r.score === 'number');
        if (validRatings.length === 0) return res.json({ average: null });
        
        const average = validRatings.reduce((acc, curr) => acc + curr.score, 0) / validRatings.length;
        
        res.json({ average });
    } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Update a rating by id
router.put('/:id', async (req, res) => {
    try {
        const rating = await Rating.findByIdAndUpdate(
            req.params.id,
            { score: req.body.score },
            { new: true }
        );
        res.json(rating);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update rating' });
    }
});

// Delete a rating by id
router.delete('/:id', async (req, res) => {
    try {
        await Rating.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rating deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete rating' });
    }
});

module.exports = router;