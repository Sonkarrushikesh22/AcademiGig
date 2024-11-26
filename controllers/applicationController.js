
const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');
const Profile = require('../models/Profile');

const applyToJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = req.body.jobId;

    // Add error logging
    console.log('Applying to job:', { userId, jobId });

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user has already applied for this job
    const alreadyApplied = await Application.findOne({ user: userId, job: jobId });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    // Get user's profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(400).json({ 
        message: 'Please complete your profile before applying to jobs' 
      });
    }

    // Create a new job application with profile reference
    const application = new Application({
      user: userId,
      job: jobId,
      profile: profile._id, 
      status: 'Applied',
    });

    // Save the application
    await application.save();

    // Populate job details before sending response
    await application.populate('job');

    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully',
      application: application
    });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching applied jobs for user:', userId);

    const applications = await Application.find({ user: userId })
      .populate({
        path: 'job',
        select: 'title company description category jobType experienceLevel location companyLogoUrl  companyLogoKey salary postedDate'
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    // Transform data to focus on jobs with application status
    const appliedJobs = applications.map(app => ({
      job: app.job,
      applicationId: app._id,
      status: app.status,
      appliedDate: app.createdAt
    }));

    console.log('Applications fetched:', appliedJobs); // Debugging

    res.status(200).json({
      success: true,
      appliedJobs
    });

  } catch (error) {
    console.error('Error fetching applied jobs:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch applied jobs',
      error: error.message 
    });
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
    getAppliedJobs ,
    getApplicationsByJob,
  };
  
