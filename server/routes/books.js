const express = require('express');
const axios = require('axios');
const router = express.Router();

const NYT_API_KEY = process.env.NYT_API_KEY;

let cache = null;
let cacheTimestamp = 0;
let namesCache = null;
let namesTimestamp = 0;
const listCache = new Map();
const TTL = 1000 * 60 * 5;

router.get('/search', async (req, res) => {
  const now = Date.now();
  if (cache && now - cacheTimestamp < 1000 * 60 * 5) {
    return handleSearch(cache, req, res); // use cached data
  }

  try {
    const response = await axios.get('https://api.nytimes.com/svc/books/v3/lists/overview.json', {
      params: { 'api-key': NYT_API_KEY },
    });

    cache = response.data;
    cacheTimestamp = now;

    return handleSearch(response.data, req, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch from NYT' });
  }
});

function handleSearch(data, req, res) {
  const { q } = req.query;
  const seen = new Set();
  const words = q.toLowerCase().split(/\s+/);
  const match = (text) => words.every(w => text.toLowerCase().includes(w));

  const results = data.results.lists
  .filter(list =>
    list.list_name.toLowerCase().includes(q.toLowerCase()) ||
    list.books.some(book =>
      book.title.toLowerCase().includes(q.toLowerCase()) ||
      book.author.toLowerCase().includes(q.toLowerCase())
    )
  )
  .flatMap(list => list.books)
  .filter(book => {
    const isMatch = match(book.title) || match(book.author);
    const id = book.primary_isbn13 || book.book_uri;
    if (seen.has(id)) return false;
    seen.add(id);
    return isMatch;
  });
  
  res.json({ results });
}

router.get('/list-names', async (req, res) => {
  const now = Date.now();
  if (namesCache && now - namesTimestamp < TTL) {
    return res.json({ results: namesCache });
  }
  try {
    const response = await axios.get(
      'https://api.nytimes.com/svc/books/v3/lists/names.json',
      { params: { 'api-key': NYT_API_KEY } }
    );
    namesCache = response.data.results;
    namesTimestamp = now;
    res.json({ results: namesCache });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch list names' });
  }
});

router.get('/current/:name', async (req, res) => {
  const { name } = req.params;
  const now = Date.now();
  const cached = listCache.get(name);
  if (cached && now - cached.timestamp < TTL) {
    return res.json({ results: cached.data });
  }
  try {
    const url = `https://api.nytimes.com/svc/books/v3/lists/current/${name}.json`;
    const response = await axios.get(url, {
      params: { 'api-key': NYT_API_KEY },
    });
    listCache.set(name, { data: response.data.results, timestamp: now });
    res.json({ results: response.data.results });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch list' });
  }
});


module.exports = router;
