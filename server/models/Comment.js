const mongoose = require("mongoose");

// Schema representing a user comment on a book
const commentSchema = new mongoose.Schema({
  bookId: String,
  userId: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
