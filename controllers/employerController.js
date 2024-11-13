const Employer = require("../models/Employer");
const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    
    const employerId = req.user.userId;
    //console.log('Attempting to use employerId:', employerId);

    if (!employerId) {
      return res.status(404).json({ 
        success: false,
        message: 'Employer not found. Please make sure you are registered as an employer' 
      });
    }
  
    let companyLogoUrl;
    if (req.file) {
      companyLogoUrl = req.file.location;
    }

    const newJob = new Job({
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      requirements: req.body.requirements,
      responsibilities: req.body.responsibilities,
      salary: req.body.salary,
      location: req.body.location,
      jobType: req.body.jobType,
      category: req.body.category,
      skills: req.body.skills,
      experienceLevel: req.body.experienceLevel,
      employers: employerId, // Fixed employer reference
      ...(companyLogoUrl && { companyLogoUrl }),
    });

    await newJob.save();

    // Link the job to the employer's jobsPosted array
    // await Employer.findByIdAndUpdate(
    //   employer._id,
    //   { $push: { jobsPosted: newJob._id } },
    //   { new: true }
    // );

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
