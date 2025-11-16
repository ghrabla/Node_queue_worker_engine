const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');

const API_PREFIX = '/api';

router.use(`${API_PREFIX}/auth`, authRoutes);


router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

router.get(`${API_PREFIX}`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the API',
    endpoints: {
      auth: `${API_PREFIX}/auth`,
    }
  });
});

module.exports = router;