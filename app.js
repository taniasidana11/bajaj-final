require('dotenv').config();
const express = require('express');
const { generateFibonacci, filterPrimes, calculateLCM, calculateHCF, getAIResponse } = require('./utils');

const app = express();
app.use(express.json());

// Official email (replace with actual Chitkara email)
const OFFICIAL_EMAIL = 'tania1530.be23@chitkarauniversity.edu.in';

// POST /bfhl
app.post('/bfhl', async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        error: 'Request must contain exactly one key'
      });
    }

    const key = keys[0];
    const value = req.body[key];

    let data;
    switch (key) {
      case 'fibonacci':
        if (typeof value !== 'number' || value < 0) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'Fibonacci input must be a non-negative integer'
          });
        }
        data = generateFibonacci(value);
        break;
      case 'prime':
        if (!Array.isArray(value)) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'Prime input must be an array'
          });
        }
        data = filterPrimes(value);
        break;
      case 'lcm':
        if (!Array.isArray(value) || value.length === 0) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'LCM input must be a non-empty array'
          });
        }
        data = calculateLCM(value);
        break;
      case 'hcf':
        if (!Array.isArray(value) || value.length === 0) {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'HCF input must be a non-empty array'
          });
        }
        data = calculateHCF(value);
        break;
      case 'AI':
        if (typeof value !== 'string') {
          return res.status(400).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: 'AI input must be a string'
          });
        }
        data = await getAIResponse(value);
        break;
      default:
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: 'Invalid key'
        });
    }

    res.json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      error: error.message
    });
  }
});

// GET / (root)
app.get('/', (req, res) => {
  res.json({
    is_success: true,
    message: 'Bajaj Assessment API is running',
    endpoints: {
      POST: '/bfhl (fibonacci, prime, lcm, hcf, AI)',
      GET: '/health'
    },
    official_email: OFFICIAL_EMAIL
  });
});

// GET /health
app.get('/health', (req, res) => {
  res.json({
    is_success: true,
    official_email: OFFICIAL_EMAIL
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    is_success: false,
    official_email: OFFICIAL_EMAIL,
    error: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
