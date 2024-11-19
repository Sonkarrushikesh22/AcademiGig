const mongoose = require('mongoose');
const { Schema } = mongoose;

const SavedJobSchema = new Schema({
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
  savedAt: {
    type: Date,
    default: Date.now, // Tracks when the job was saved
  },
});

module.exports = mongoose.model('SavedJob', SavedJobSchema);
