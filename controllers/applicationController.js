
const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');

const applyToJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobId = req.body.jobId;

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

    // Retrieve user's profile
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Generate presigned URL for the resume
    const { getObjectURL } = require('../utils/s3'); // Import the S3 utilities
    const resumeUrl = await getObjectURL(`user-resumes/${profile.resumeKey}`);

    // Create a new job application
    const application = new Application({
      user: userId,
      job: jobId,
      coverLetter: req.body.coverLetter || '',
      status: 'Applied',
    });

    // Save the application
    await application.save();

    res.status(201).json({
      message: 'Job application submitted successfully',
      application: {
        ...application.toObject(),
        profile,
        resumeUrl,
      },
    });
  } catch (error) {
    console.error('Error applying to job:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


// for user to fetch applied jobs
const getApplicationsByUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find applications submitted by the user
    const applications = await Application.find({ user: userId }).populate('job', 'title company');

    // Include presigned URLs for resumes
    const { getObjectURL } = require('../utils/s3'); // Import the S3 utilities
    const applicationsWithDetails = await Promise.all(
      applications.map(async (application) => {
        const profile = await Profile.findOne({ user: userId });
        const resumeUrl = profile?.resumeKey ? await getObjectURL(`user-resumes/${profile.resumeKey}`) : null;

        return {
          ...application.toObject(),
          profile,
          resumeUrl,
        };
      })
    );

    res.status(200).json(applicationsWithDetails);
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
  
