const express = require('express');
const axios = require('axios');

const router = express.Router();
const NYT_API_KEY = process.env.NYT_API_KEY;

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.nytimes.com/svc/books/v3/lists/names.json',
      { params: { 'api-key': NYT_API_KEY } }
    );
    res.json({ results: response.data.results });
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;