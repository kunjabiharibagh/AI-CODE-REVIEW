require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// ─── CORS FIX ─────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ai-code-review-livid.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Body Parser ──────────────────────────────────
app.use(express.json());

// ─── Health Check ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Server is working fine ✅' });
});

// ─── Routes ───────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/code', require('./routes/codeRoutes'));

// ─── Start Server ─────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});