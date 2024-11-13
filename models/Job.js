const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [String], // Array of requirements
  responsibilities: [String], // Array of responsibilities
  salary: {
    min: {
      type: Number,
      required: false,
    },
    max: {
      type: Number,
      required: false,
    },
    currency: {
      type: String,
      default: 'USD',
    },
  },
  location: {
    city: String,
    state: String,
    country: String,
    remote: {
      type: Boolean,
      default: false,
    },
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  applicationDeadline: {
    type: Date,
  },
  skills: [String], // Required skills
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior'],
  },
  employers: {
    type: Schema.Types.ObjectId,
    ref: 'Employer', // Reference to the Employer model
    required: true,
  },
  companyLogoUrl: String,
});

module.exports = mongoose.model('Job', JobSchema);
