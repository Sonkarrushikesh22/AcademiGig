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
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile', // Reference to the Profile schema
    required: true,
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
