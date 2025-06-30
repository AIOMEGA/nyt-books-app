const express = require('express');
const axios = require('axios');
const router = express.Router();

const NYT_API_KEY = process.env.NYT_API_KEY;

router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const response = await axios.get(`https://api.nytimes.com/svc/books/v3/reviews.json`, {
      params: {
        'api-key': NYT_API_KEY,
        title: q,
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch from NYT' });
  }
});

module.exports = router;