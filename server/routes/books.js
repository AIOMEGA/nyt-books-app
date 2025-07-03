// Routes that proxy requests to the NYT Books API
const express = require("express");
const axios = require("axios");
const router = express.Router();

const NYT_API_KEY = process.env.NYT_API_KEY;

// Simple in-memory cache to avoid hitting the external API too often
let cache = null;
let cacheTimestamp = 0;

// Search the NYT API with caching to limit outbound requests
router.get("/search", async (req, res) => {
  const now = Date.now();
  // If we have cached results from the last 5 minutes use them
  if (cache && now - cacheTimestamp < 1000 * 60 * 5) {
    return handleSearch(cache, req, res); // use cached data
  }

  try {
    // Fetch the latest list overview from NYT
    const response = await axios.get(
      "https://api.nytimes.com/svc/books/v3/lists/overview.json",
      {
        params: { "api-key": NYT_API_KEY },
      }
    );

    cache = response.data;
    cacheTimestamp = now;

    return handleSearch(response.data, req, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch from NYT" });
  }
});

// Helper that filters NYT data based on a search query
function handleSearch(data, req, res) {
  const { q } = req.query; // search query
  const seen = new Set(); // prevent duplicate results
  const words = q.toLowerCase().split(/\s+/);
  // returns true if all query words appear in the text
  const match = (text) => words.every((w) => text.toLowerCase().includes(w));

  const results = data.results.lists
    // only keep lists or books that match the query
    .filter(
      (list) =>
        list.list_name.toLowerCase().includes(q.toLowerCase()) ||
        list.books.some(
          (book) =>
            book.title.toLowerCase().includes(q.toLowerCase()) ||
            book.author.toLowerCase().includes(q.toLowerCase())
        )
    )
    // flatten to a single list of books
    .flatMap((list) => list.books)
    // eliminate duplicates and fuzzy match title/author
    .filter((book) => {
      const isMatch = match(book.title) || match(book.author);
      const id = book.primary_isbn13 || book.book_uri;
      if (seen.has(id)) return false;
      seen.add(id);
      return isMatch;
    });

  res.json({ results });
}

module.exports = router;
