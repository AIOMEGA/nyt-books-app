const mongoose = require("mongoose");

// Schema storing a user's rating for a book
const ratingSchema = new mongoose.Schema({
  bookId: String,
  userId: String,
  score: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
