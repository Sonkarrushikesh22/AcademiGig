const mongoose = require('mongoose');
const SavedJobs = require('../models/SavedJob');
const User = require('../models/User');
const Job = require('../models/Job');

// Controller to save a job
const saveJob = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const jobId = (req.body.jobId); 

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if job is already saved
    const alreadySaved = await SavedJobs.findOne({ user: userId, job: jobId });
    if (alreadySaved) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    // Save job
    const savedJob = new SavedJobs({ user: userId, job: jobId });
    await savedJob.save();

    res.status(201).json({ message: 'Job saved successfully', savedJob });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ message: 'Error saving job', error });
  }
};

// Controller to get saved jobs
const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;// Extract user ID from the decoded JWT token

    // Find saved jobs for the user and populate job details
    const savedJobs = await SavedJobs.find({ user: userId }).populate('job');

    res.status(200).json(savedJobs);
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ message: 'Error fetching saved jobs', error });
  }
};

// Controller to delete a saved job
const deleteSavedJob = async (req, res) => {
  try {
    const userId = req.user.userId;// Extract user ID from the decoded JWT token
    const jobId = String(req.params.jobId); // Ensure jobId is a string

    // Debug log
    console.log('Received jobId for deletion:', jobId, 'Type:', typeof jobId);

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    // Find and delete saved job
    const deletedJob = await SavedJobs.findOneAndDelete({ user: userId, job: jobId });

    if (!deletedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    res.status(200).json({ message: 'Saved job deleted successfully' });
  } catch (error) {
    console.error('Error deleting saved job:', error);
    res.status(500).json({ message: 'Error deleting saved job', error });
  }
};

module.exports = { saveJob, getSavedJobs, deleteSavedJob };
