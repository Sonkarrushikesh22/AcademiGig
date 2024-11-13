// models/JobApplication.js
const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Reference to the Job schema
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true, // URL to the uploaded resume file
  },
  coverLetter: {
    type: String, // Optional cover letter text
    required: false,
  },
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Offered', 'Rejected', 'Withdrawn'],
    default: 'Applied',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
