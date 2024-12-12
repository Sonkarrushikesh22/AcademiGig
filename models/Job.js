const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Job Schema
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
  requirements: [String],
  responsibilities: [String],
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' },
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    },
    city: String,
    state: String,
    country: String,
    remote: { type: Boolean, default: false },
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
  postedDate: { type: Date, default: Date.now },
  applicationDeadline: { type: Date },
  skills: [String],
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior'],
  },
  employers: {
    type: Schema.Types.ObjectId,
    ref: 'Employer',
    required: true,
  },
  companyLogoKey: String,
});

// Add Text Index
JobSchema.index(
  {
    title: 'text',
    company: 'text',
    description: 'text',
  },
  {
    weights: {
      title: 10,
      company: 5,
      description: 1,
    },
    name: 'JobSearchIndex',
  }
);

// Add Geospatial Index
JobSchema.index({ "location": "2dsphere" });

// Create the Job Model
const Job = mongoose.model('Job', JobSchema);

// Ensure Index Creation
Job.createIndexes()
  .then(() => {
    console.log('Job search and geospatial indexes created successfully');
  })
  .catch((err) => {
    console.error('Error creating job indexes:', err);
  });

module.exports = Job;