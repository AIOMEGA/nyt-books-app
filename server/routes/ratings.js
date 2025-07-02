const express = require('express');
const Rating = require('../models/Rating');
const router = express.Router();

// POST a new rating
router.post('/', async (req, res) => {
    const { bookId, score } = req.body;
    try {
        const newRating = new Rating({ bookId, score });
        await newRating.save();
        res.status(201).json(newRating);
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
    if (ratings.length === 0) return res.json({ average: null });
    
    const average = ratings.reduce((acc, curr) => acc + curr.score, 0) / validRatings.length;
    
    res.json({ average });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
});  
module.exports = router;