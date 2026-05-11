// Import jwt to verify tokens
const jwt = require('jsonwebtoken');

// Import User model to find user from token
const User = require('../models/User');

// ─── Protect Middleware ────────────────────────────
// This function runs BEFORE protected routes
// It checks if request has valid token
const protect = async (req, res, next) => {
  try {
    console.log('Protect middleware hit ✅');

    // Get token from request headers
    // Frontend sends: Authorization: Bearer eyJhbGci...
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);

    // Check if header exists and starts with Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized. No token provided.'
      });
    }

    // Extract token from "Bearer eyJhbGci..."
    // Split by space and take second part
    const token = authHeader.split(' ')[1];
    console.log('Token extracted ✅');

    // Verify token using our secret key
    // If token is fake or expired this will throw error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded ✅:', decoded);

    // Find user from id stored inside token
    const user = await User.findById(decoded.id);

    // If user deleted after token was issued
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists.'
      });
    }

    // Attach user to request object
    // Now any route after this can access req.user
    req.user = user;
    console.log('User attached to request ✅:', user.name);

    // Call next() to move to actual route
    next();

  } catch (error) {
    console.log('❌ Auth error:', error.message);

    // Token expired
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.'
      });
    }

    // Token invalid
    return res.status(401).json({
      success: false,
      error: 'Invalid token. Please login again.'
    });
  }
};

module.exports = { protect };