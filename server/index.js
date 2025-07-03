// Core server dependencies
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// API route handlers
const ratingsRouter = require("./routes/ratings");
const commentsRouter = require("./routes/comments");
const authRouter = require("./routes/auth");

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Allow requests from the frontend dev server
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Automatically parse incoming JSON
app.use(express.json());

// Mount API routes
app.use("/api/auth", authRouter);
app.use("/api/ratings", ratingsRouter);
app.use("/api/comments", commentsRouter);

const PORT = process.env.PORT || 5000; // fallback for local dev

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB not connected:", err.message));

// Routes
const booksRouter = require("./routes/books");
app.use("/api/books", booksRouter);

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
