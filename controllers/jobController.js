const Job = require('../models/Job');
const s3Service = require('../services/fileUploadService');

exports.getAllJobs = async (req, res) => {
  try {
    const { 
      search, category, jobType, experienceLevel, location, 
      page = 1, limit = 10, sortBy = 'postedDate', sortOrder = 'desc' 
    } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filtering by category, job type, and experience level
    if (category) query.category = category;
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;

    // Filtering by location
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
        { 'location.remote': location === 'remote' },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Fetch jobs and total count
    const jobs = await Job.find(query).sort(sortOptions).skip(skip).limit(Number(limit));
    const total = await Job.countDocuments(query);

    // Fetch presigned URLs for logos
    const jobsWithLogos = await Promise.all(
      jobs.map(async (job) => {
        if (job.companyLogoKey) {
          const presignedUrl = await s3Service.getObjectURL(job.companyLogoKey);
          return { ...job.toObject(), companyLogoUrl: presignedUrl };
        }
        return job.toObject();
      })
    );

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      jobs: jobsWithLogos,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs.',
    });
  }
};

 
exports.getJobDetails = async (req, res) => {
  try {
    const { id } = req.params; // Extract job ID from request parameters

    // Fetch job by ID
    const job = await Job.findById(id).populate('employers', 'name email');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Fetch presigned URL for company logo if it exists
    let companyLogoUrl = null;
    if (job.companyLogoKey) {
      companyLogoUrl = await s3Service.getObjectURL(job.companyLogoKey);
    }

    // Return job details along with logo URL
    res.status(200).json({
      success: true,
      job: { ...job.toObject(), companyLogoUrl },
    });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job details.',
    });
  }
};


exports.getDownloadPresignedUrl = async (req, res) => {
  try {
    const { key, fileType } = req.query;

    // Validate required parameters
    if (!key) {
      return res.status(400).json({ message: 'Missing file key' });
    }

    // Determine the folder based on fileType
    let folder;
    if (fileType === 'job-logo') {
      folder = 'job-logos';
    }
    else {
      return res.status(400).json({ message: 'Invalid file type. Use "job-logo".' });
    }

    // Generate presigned URL for downloading the file
    const presignedUrl = await s3Service.getObjectURL(`${key}`);

    // Return the presigned URL to the client
    res.status(200).json({ presignedUrl });
  } catch (error) {
    console.error('Error generating download presigned URL:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getJobsByCategory = async (req, res) => {
  try {
    const { 
      category, 
      page = 1, 
      limit = 10, 
      sortBy = 'postedDate', 
      sortOrder = 'desc' 
    } = req.query;

    // Validate category is provided
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    const query = { category };

    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Fetch jobs by category
    const jobs = await Job.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Count total jobs in this category
    const total = await Job.countDocuments(query);

    // Fetch presigned URLs for logos
    const jobsWithLogos = await Promise.all(
      jobs.map(async (job) => {
        if (job.companyLogoKey) {
          const presignedUrl = await s3Service.getObjectURL(job.companyLogoKey);
          return { ...job.toObject(), companyLogoUrl: presignedUrl };
        }
        return job.toObject();
      })
    );

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      jobs: jobsWithLogos,
    });
  } catch (error) {
    console.error('Error fetching jobs by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs by category.',
    });
  }
};


