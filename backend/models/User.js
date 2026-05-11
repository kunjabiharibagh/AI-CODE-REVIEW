// Import mongoose to create database schema
const mongoose = require('mongoose');

// Import bcrypt to hash passwords
const bcrypt = require('bcryptjs');

// Define what a User looks like in database
const userSchema = new mongoose.Schema({

  // User's name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  // User's email - must be unique
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },

  // User's password - select:false means
  // password never returns in queries
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },

  // Count how many reviews user has done
  reviewCount: {
    type: Number,
    default: 0
  },

  // Automatically save signup date
  createdAt: {
    type: Date,
    default: Date.now
  }

});

// ─── Before saving - hash the password ────────────
userSchema.pre('save', async function() {

  // Skip if password not changed
  if (!this.isModified('password')) return;

  // Generate salt - 12 means very secure
  const salt = await bcrypt.genSalt(12);

  // Replace plain password with hashed version
  this.password = await bcrypt.hash(this.password, salt);

});

// ─── Method to check password on login ────────────
// Called like: user.comparePassword('test1234')
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export model - 'User' becomes collection in MongoDB
module.exports = mongoose.model('User', userSchema);