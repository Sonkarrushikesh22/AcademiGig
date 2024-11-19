const Employer = require("../models/Employer");
const Job = require('../models/Job');
const s3Service = require('../services/fileUploadService');

exports.createJob = async (req, res) => {
  try {
    const employerId = req.user.userId;

    if (!employerId) {
      return res.status(404).json({
        success: false,
        message: 'Employer not found. Please make sure you are registered as an employer',
      });
    }

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
      skills,
      experienceLevel,
      logoFilename,
      logoContentType,
    } = req.body;

    let companyLogoKey = null;

    // Generate presigned URL for company logo if filename and content type are provided
    if (logoFilename && logoContentType) {
      companyLogoKey = `company-logos/${logoFilename}`;
      const presignedUrl = await s3Service.putObjectURL(logoFilename, logoContentType, 'logo');
      
      // Respond with the presigned URL so the client can upload the logo
      res.status(200).json({
        message: 'Presigned URL generated for company logo upload',
        presignedUrl,
        companyLogoKey,
      });
      return;
    }

    // Create a new job without waiting for logo upload (optional step for a different flow)
    const newJob = new Job({
      title,
      company,
      description,
      requirements,
      responsibilities,
      salary,
      location,
      jobType,
      category,
      skills,
      experienceLevel,
      employers: employerId,
      ...(companyLogoKey && { companyLogoUrl: companyLogoKey }),
    });

    await newJob.save();

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
