const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    bookId: String,
    score: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});  

module.exports = mongoose.model('Rating', ratingSchema);