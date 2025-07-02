const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const ratingsRouter = require('./routes/ratings');
const commentsRouter = require('./routes/comments');
const authRouter = require('./routes/auth');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/comments', commentsRouter);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB not connected:', err.message));

// Routes
const booksRouter = require('./routes/books');
app.use('/api/books', booksRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
