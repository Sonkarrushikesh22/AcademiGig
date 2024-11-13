
const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');

const applyToJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = req.body.jobId;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user has already applied for this job
    const alreadyApplied = await Application.findOne({ user: userId, job: jobId });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    // Create a new job application
    const application = new Application({
      user: userId,
      job: jobId,
      resumeUrl: req.file ? req.file.location : null,
      coverLetter: req.body.coverLetter || '',
    });

    await application.save();

    res.status(201).json({ message: 'Job application submitted successfully', application });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// for user to fetch applied jobs
  const getApplicationsByUser = async (req, res) => {
    try {
      const userId = req.user.userId;
      const applications = await Application.find({ user: userId }).populate('job', 'title company');
      res.status(200).json(applications);
    } catch (error) {
      console.error('Error fetching user applications:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // for employer to fetch applications for a job
  const getApplicationsByJob = async (req, res) => {
    try {
      const jobId = String(req.params.jobId);
      const applications = await Application.find({ job: jobId }).populate('user', 'name email');
      res.status(200).json(applications);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  module.exports = {
    applyToJob,
    getApplicationsByUser,
    getApplicationsByJob,
  };
  
