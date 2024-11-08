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
    required: true, // URL to the user's resume stored in S3 or another storage
  },
  coverLetter: {
    type: String, // Optional cover letter text
    required: false,
  },
  status: {
    type: String,
    enum: ['Applied', 'Interviewing', 'Offered', 'Rejected', 'Withdrawn'],
    default: 'Applied', // Tracks application status
  },
  appliedAt: {
    type: Date,
    default: Date.now, // Timestamp when the application was submitted
  },
  notes: {
    type: String, // Optional field for any application notes
  },
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
