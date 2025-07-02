const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    bookId: String,
    text: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Comment', commentSchema);