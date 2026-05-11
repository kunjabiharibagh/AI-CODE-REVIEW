const express = require('express');
const router = express.Router();

// Import protect middleware
const { protect } = require('../middleware/auth');

// Import reviewCode controller
const { reviewCode,getHistory,getSingleReview } = require('../controllers/codeController');

// POST /api/code/review
// protect runs first - must be logged in
router.post('/review', protect, reviewCode);
router.get('/history', protect, getHistory);
router.get('/history/:id', protect, getSingleReview);   
module.exports = router;