const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmployerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  jobsPosted: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Job', // Reference to the Job model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Employer', EmployerSchema);
