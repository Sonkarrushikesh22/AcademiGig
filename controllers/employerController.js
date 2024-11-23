const Employer = require("../models/Employer");
const Job = require('../models/Job');
const s3Service = require('../services/fileUploadService');

exports.getUploadPresignedUrl = async (req, res) => {
  try {
    // Get file type, filename, and content type from query parameters
    const { fileType, filename, contentType } = req.query;

    // Validate required parameters
    if (!fileType || !filename || !contentType) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Determine the folder based on fileType
    let folder;
    if (fileType === 'job-logo') {
      folder = 'job-logos';
    }
    else {
      return res.status(400).json({ message: 'Invalid file type. Use "job-logo".' });
    }

    // Generate presigned URL for the requested file
    // Passing the parameters to the s3Service to get the URL
    const presignedUrl = await s3Service.putObjectURL(filename, contentType, folder);

    // Return the presigned URL to the client
    res.status(200).json({ presignedUrl });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.createJob = async (req, res) => {
  try {
    const employerId = req.user.userId; // Ensure the user is authenticated
    const {
      title,
      company,
      description,
      requirements,
      responsibilities,
      salary,
      location,
      jobType,
      category,
      applicationDeadline,
      skills,
      experienceLevel,
      companyLogoKey,
    } = req.body;

    // Validate required fields
    if (!title || !company || !description || !jobType || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate employer existence
    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    const jobData = {
      title,
      company,
      description,
      requirements,
      responsibilities,
      salary,
      location,
      jobType,
      category,
      applicationDeadline,
      skills,
      experienceLevel,
      employers: employerId, 
    };

    // Handle logo upload key
    if (companyLogoKey) {
      jobData.companyLogoKey = `job-logos/${companyLogoKey}`;
    }

    // Create and save the job
    const job = new Job(jobData);
    await job.save();

    // Update the employer's `jobsPosted` array
    employer.jobsPosted.push(job._id);
    await employer.save();

    res.status(201).json({
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

