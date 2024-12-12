const Job = require('../models/Job');
const s3Service = require('../services/fileUploadService');
const mongoose = require('mongoose');

exports.getAllJobs = async (req, res) => {
  try {
    const { 
      search, category, jobType, experienceLevel, location, 
      page = 1, limit = 10, sortBy = 'postedDate', sortOrder = 'desc' 
    } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      // Use text search instead of regex
      query.$text = { 
        $search: search 
      };
      
      // Add text score sorting when search is used
      sortOptions = {
        score: { $meta: "textScore" },
        ...sortOptions
      };
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
        { 'location.latitude': { $regex: location, $options: 'i' } },
        { 'location.longitude': { $regex: location, $options: 'i' } },
        { 'location.remote': location === 'remote' },
      ];
    }

    if (req.query.requireLocation) {
      query['location.latitude'] = { $exists: true };
      query['location.longitude'] = { $exists: true };
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

 
// exports.getJobDetails = async (req, res) => {
//   try {
//     const { id } = req.params; // Extract job ID from request parameters

//     // Fetch job by ID
//     const job = await Job.findById(id).populate('employers', 'name email');

//     if (!job) {
//       return res.status(404).json({ success: false, message: 'Job not found' });
//     }

//     // Fetch presigned URL for company logo if it exists
//     let companyLogoUrl = null;
//     if (job.companyLogoKey) {
//       companyLogoUrl = await s3Service.getObjectURL(job.companyLogoKey);
//     }

//     // Return job details along with logo URL
//     res.status(200).json({
//       success: true,
//       job: { ...job.toObject(), companyLogoUrl },
//     });
//   } catch (error) {
//     console.error('Error fetching job details:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch job details.',
//     });
//   }
// };


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

//job filter
exports.filterJobs = async (req, res) => {
  try {
    console.log('Received Raw Filter Parameters:', req.query);

    const {
      search,
      page = 1,
      limit = 10,
      sortBy = 'postedDate',
      sortOrder = 'desc',
      category,
      jobType,
      experienceLevel,
      minSalary,
      maxSalary,
      currency,
      city,
      state,
      country,
      isRemote,
      postedAfter,
      postedBefore,
      skills,
    } = req.query;

    // Input validation with strict type checking
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));
    
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters'
      });
    }

    // Strict validation for sort parameters
    const allowedSortFields = ['postedDate', 'salary.min', 'title', 'company'];
    if (sortBy && !allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sortBy parameter'
      });
    }

    if (sortOrder && !['asc', 'desc'].includes(sortOrder.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sortOrder parameter'
      });
    }

    // Initialize base query
    const query = {};

    // Text search with validation
    if (search && typeof search === 'string' && search.trim()) {
      // Using text index for search
      query.$text = { $search: search.trim() };
    }

    // Category validation
    if (category && typeof category === 'string') {
      query.category = category.trim();
    }

    // JobType validation - using enum values
    if (jobType && typeof jobType === 'string') {
      const validJobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
      if (validJobTypes.includes(jobType)) {
        query.jobType = jobType;
      }
    }

    // ExperienceLevel validation - using enum values
    if (experienceLevel && typeof experienceLevel === 'string') {
      const validExperienceLevels = ['Entry', 'Mid', 'Senior'];
      if (validExperienceLevels.includes(experienceLevel)) {
        query.experienceLevel = experienceLevel;
      }
    }

    // Salary Range filtering - adjusted for nested structure
    const parsedMinSalary = parseFloat(minSalary);
    const parsedMaxSalary = parseFloat(maxSalary);
    
    if (!isNaN(parsedMinSalary) || !isNaN(parsedMaxSalary)) {
      if (!isNaN(parsedMinSalary) && !isNaN(parsedMaxSalary)) {
        // Both min and max provided
        query.$and = [
          { 'salary.min': { $lte: parsedMaxSalary } },
          { 'salary.max': { $gte: parsedMinSalary } }
        ];
      } else if (!isNaN(parsedMinSalary)) {
        // Only min salary provided
        query['salary.min'] = { $gte: parsedMinSalary };
      } else if (!isNaN(parsedMaxSalary)) {
        // Only max salary provided
        query['salary.max'] = { $lte: parsedMaxSalary };
      }
    }

    // Currency filtering
    if (currency && typeof currency === 'string') {
      query['salary.currency'] = currency.toUpperCase();
    }

    // Location filtering with validation
    if (city || state || country || isRemote) {
      const locationQuery = {};
      
      if (city && typeof city === 'string') {
        locationQuery['location.city'] = new RegExp(city.trim(), 'i');
      }
      
      if (state && typeof state === 'string') {
        locationQuery['location.state'] = new RegExp(state.trim(), 'i');
      }
      
      if (country && typeof country === 'string') {
        locationQuery['location.country'] = new RegExp(country.trim(), 'i');
      }
      
      if (isRemote) {
        locationQuery['location.remote'] = String(isRemote).toLowerCase() === 'true';
      }
      
      Object.assign(query, locationQuery);
    }

    // Skills filtering with validation
    if (skills) {
      let skillsArray = [];
      if (Array.isArray(skills)) {
        skillsArray = skills.filter(skill => typeof skill === 'string' && skill.trim());
      } else if (typeof skills === 'string') {
        skillsArray = skills.split(',')
          .map(skill => skill.trim())
          .filter(skill => skill);
      }

      if (skillsArray.length > 0) {
        query.skills = { $all: skillsArray };
      }
    }

    // Date filtering with strict validation
    if (postedAfter || postedBefore) {
      query.postedDate = {};
      
      if (postedAfter) {
        const afterDate = new Date(postedAfter);
        if (!isNaN(afterDate.getTime())) {
          query.postedDate.$gte = afterDate;
        }
      }
      
      if (postedBefore) {
        const beforeDate = new Date(postedBefore);
        if (!isNaN(beforeDate.getTime())) {
          query.postedDate.$lte = beforeDate;
        }
      }
      
      if (Object.keys(query.postedDate).length === 0) {
        delete query.postedDate;
      }
    }

    // Debug logging
    console.log('Final Query:', JSON.stringify(query, null, 2));

    // Sorting - adjusted for nested salary field
    const sortOptions = {};
    if (sortBy === 'salary.min') {
      sortOptions['salary.min'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query with aggregation pipeline
    const pipeline = [
      { $match: query },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: limitNumber },
      {
        $project: {
          title: 1,
          company: 1,
          description: 1,
          requirements: 1,
          responsibilities: 1,
          salary: 1,
          location: 1,
          jobType: 1,
          category: 1,
          postedDate: 1,
          applicationDeadline: 1,
          skills: 1,
          experienceLevel: 1,
          employers: 1,
          companyLogoKey: 1
        }
      }
    ];

    // Execute query and count in parallel
    const [jobs, totalCount] = await Promise.all([
      Job.aggregate(pipeline),
      Job.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    // Return response with metadata
    return res.status(200).json({
      success: true,
      total: totalCount,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
      jobs: jobs || []
    });

  } catch (error) {
    console.error('Job Filtering Error:', {
      message: error.message,
      stack: error.stack,
      query: req.query
    });

    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? `Error filtering jobs: ${error.message}`
        : 'An unexpected error occurred while filtering jobs'
    });
  }
};
// Enhanced Filter Options Endpoint
exports.getFilterOptions = async (req, res) => {
  try {
    const [categories, jobTypes, experienceLevels, currencies, countries] = await Promise.all([
      Job.distinct('category'),
      Job.distinct('jobType'),
      Job.distinct('experienceLevel'),
      Job.distinct('salary.currency'),
      Job.distinct('location.country')
    ]);

    // Cache the response for 1 hour since these don't change frequently
    res.set('Cache-Control', 'public, max-age=3600');
    res.status(200).json({
      success: true,
      options: {
        categories: categories.filter(Boolean).sort(),
        jobTypes: jobTypes.filter(Boolean).sort(),
        experienceLevels: experienceLevels.filter(Boolean).sort(),
        currencies: currencies.filter(Boolean).sort(),
        countries: countries.filter(Boolean).sort()
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filter options',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ti get job within radius of a location
exports.getJobsInRadius = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 50,
      page = 1,
      limit = 10,
      sortBy = 'distance'
    } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];
    const radiusInMeters = parseFloat(radius) * 1000;

    const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: coordinates
          },
          distanceField: 'distance',
          maxDistance: radiusInMeters,
          distanceMultiplier: 0.001, // Convert to kilometers
          spherical: true
        }
      },
      {
        $sort: { distance: 1 }
      },
      {
        $skip: (parseInt(page) - 1) * parseInt(limit)
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          _id: 1,
          title: 1,
          company: 1,
          location: 1,
          salary: 1,
          distance: 1,
          coordinates: '$location.coordinates',
          distanceText: {
            $concat: [{ $toString: { $round: ['$distance', 1] } }, ' km away']
          }
        }
      }
    ];

    const [jobs, totalCount] = await Promise.all([
      Job.aggregate(pipeline),
      Job.aggregate([...pipeline.slice(0, 1), { $count: 'total' }])
    ]);

    // Format the response to be more map-friendly
    const formattedJobs = jobs.map(job => ({
      id: job._id.toString(),
      title: job.title,
      company: job.company,
      coordinate: {
        latitude: job.coordinates[1],
        longitude: job.coordinates[0]
      },
      distance: job.distance,
      distanceText: job.distanceText,
      salary: job.salary
    }));

    res.status(200).json({
      success: true,
      total: totalCount[0]?.total || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      searchLocation: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radiusKm: parseFloat(radius)
      },
      jobs: formattedJobs
    });
  } catch (error) {
    console.error('Error fetching jobs by location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs by location'
    });
  }
};