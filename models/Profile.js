// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  about: {
    type: String,
  },
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  experience: [
    {
      title: String,
      company: String,
      location: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String,
    },
  ],
  avatarKey: { // Stores S3 key for profile picture
    type: String,
  },
  resumeKey: { // Stores S3 key for resume
    type: String,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Profile', profileSchema);
