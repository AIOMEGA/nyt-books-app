// CRUD operations related to book ratings
const express = require("express");
const Rating = require("../models/Rating");
const auth = require("../middleware/auth");
const router = express.Router();

// POST a rating or update an existing rating for the same user
router.post("/", auth, async (req, res) => {
  const { bookId, score } = req.body;
  const userId = req.userId;
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
    res.status(500).json({ error: "Failed to save rating" });
  }
});

// GET average rating and rating breakdown for a book
router.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;
  try {
    const ratings = await Rating.find({ bookId, score: { $exists: true } });
    const validRatings = ratings.filter((r) => typeof r.score === "number");
    if (validRatings.length === 0)
      return res.json({ average: null, scores: [] });

    const rawAvg =
      validRatings.reduce((acc, curr) => acc + curr.score, 0) /
      validRatings.length;
    const average = Math.round(rawAvg * 2) / 2; // round to nearest 0.5

    const scores = validRatings.map((r) => r.score);

    res.json({ average, scores });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch ratings" });
  }
});

// Update a previously created rating
router.put("/:id", auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ error: "Rating not found" });
    if (rating.userId.toString() !== req.userId)
      return res.status(403).json({ error: "Not authorized" });

    rating.score = req.body.score;
    await rating.save();
    res.json(rating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update rating" });
  }
});

// Delete a rating entirely
router.delete("/:id", auth, async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ error: "Rating not found" });
    if (rating.userId.toString() !== req.userId)
      return res.status(403).json({ error: "Not authorized" });

    await Rating.findByIdAndDelete(req.params.id);
    res.json({ message: "Rating deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete rating" });
  }
});

module.exports = router;
