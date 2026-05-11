// Import User model
const User = require('../models/User');

// Import jwt to create tokens
const jwt = require('jsonwebtoken');

// Import validator to check inputs
const { validationResult } = require('express-validator');

// ─── Helper: Generate JWT Token ───────────────────
// Takes user id and creates a secure token
// Token expires in 7 days (from .env)
const generateToken = (id) => {
  return jwt.sign(
    { id },                        // payload - what we store inside token
    process.env.JWT_SECRET,        // secret key to sign token
    { expiresIn: process.env.JWT_EXPIRE || '7d' }  // expiry time
  );
};

// ─── REGISTER ─────────────────────────────────────
const register = async (req, res) => {
  try {
    console.log('Register hit ✅');
    console.log('Body received:', req.body);

    // Check validation errors from routes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    // Get data from request body
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Create user in database
    // Password is auto hashed by User model
    const user = await User.create({ name, email, password });
    console.log('User created ✅:', user._id);

    // Generate token for this user
    const token = generateToken(user._id);

    // Send success response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log('❌ Register error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ─── LOGIN ────────────────────────────────────────
const login = async (req, res) => {
  try {
    console.log('Login hit ✅');
    console.log('Body received:', req.body);

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    // Get email and password from request
    const { email, password } = req.body;

    // Find user by email
    // +password because select:false hides it by default
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'yes' : 'no');

    // If no user found with that email
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch ? 'yes' : 'no');

    // If password wrong
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send success response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.log('❌ Login error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
// ─── GET PROFILE ──────────────────────────────────
// Only works if protect middleware passes
// req.user is set by protect middleware
const getProfile = async (req, res) => {
  try {
    console.log('Profile hit ✅');
    console.log('User from token:', req.user.name);

    // req.user already has user data from protect middleware
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        reviewCount: req.user.reviewCount,
        createdAt: req.user.createdAt
      }
    });

  } catch (error) {
    console.log('❌ Profile error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { register, login , getProfile };