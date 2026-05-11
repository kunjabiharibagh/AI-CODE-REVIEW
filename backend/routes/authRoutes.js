// Import express and create router
const express = require('express');
const router = express.Router();

// Import validator
const { body } = require('express-validator');

// Import register function
const { register,login,getProfile } = require('../controllers/authController');
const {protect}= require('../middleware/auth');
// Validation rules for register
const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('email')
    .isEmail()
    .withMessage('Enter a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

// Login validation rules
const loginRules = [
  body('email')
    .isEmail()
    .withMessage('Enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Register route
// POST /api/auth/register
router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.get('/profile', protect,getProfile);
module.exports = router;