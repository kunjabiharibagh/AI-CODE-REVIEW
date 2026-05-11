const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

  // Which user did this review
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // The code that was reviewed
  code: {
    type: String,
    required: true
  },

  // Programming language
  language: {
    type: String,
    required: true
  },

  // AI review text
  review: {
    type: String,
    required: true
  },

  // Quality score 0-100
  score: {
    type: Number,
    default: null
  },

  // When review was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);