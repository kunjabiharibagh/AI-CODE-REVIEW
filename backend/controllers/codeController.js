const Groq = require('groq-sdk');
const User = require('../models/User');
const Review = require('../models/Review');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// ─── REVIEW CODE ──────────────────────────────────
const reviewCode = async (req, res) => {
  try {
    console.log('Code review hit ✅');

    const { code, language } = req.body;

    // Validate inputs
    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    if (!language || !language.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Language is required'
      });
    }

    if (code.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Code too long. Maximum 5000 characters.'
      });
    }

    // Build prompt
    const prompt = `You are an expert code reviewer.
Analyze the following ${language} code and provide detailed review.

Structure your response with these exact sections:
## 🐛 Bugs & Errors
## ✅ What is Good
## ⚡ Performance Issues
## 🔒 Security Concerns
## 💡 Improvement Suggestions
## 📊 Code Quality Score

For score section give a number 0-100 like: SCORE:75

Be specific and use backticks for code examples.

Code to review:
\`\`\`${language}
${code}
\`\`\``;

    // Send to Groq
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    });

    const reviewText = response.choices[0].message.content;

    // Extract score
    const scoreMatch = reviewText.match(/SCORE:\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    // Clean review text
    const cleanReview = reviewText.replace(/SCORE:\s*\d+\n?/g, '');

    // Save review to database
    const savedReview = await Review.create({
      user: req.user._id,
      code,
      language,
      review: cleanReview,
      score
    });
    console.log('Review saved to DB ✅:', savedReview._id);

    // Update user review count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { reviewCount: 1 }
    });

    res.json({
      success: true,
      data: {
        id: savedReview._id,
        review: cleanReview,
        score,
        language,
        reviewedAt: savedReview.createdAt
      }
    });

  } catch (error) {
    console.log('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ─── GET HISTORY ──────────────────────────────────
const getHistory = async (req, res) => {
  try {
    console.log('Get history hit ✅');

    // Find all reviews for logged in user
    // Sort by newest first
    // Limit to 10 most recent
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('language score createdAt code');

    res.json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.log('❌ History error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ─── GET SINGLE REVIEW ────────────────────────────
const getSingleReview = async (req, res) => {
  try {
    console.log('Get single review hit ✅');

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id  // Make sure review belongs to user
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    console.log('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { reviewCode, getHistory, getSingleReview };