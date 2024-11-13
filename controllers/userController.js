const User = require('../models/User');
const  Employer = require('../models/Employer');
const Profile = require('../models/Profile');


exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, location, phone, about, skills, experience } = req.body;
    let avatarUrl;

    if (req.file) {
      avatarUrl = req.file.location;
    }

    const updateData = {
      name,
      location,
      phone,
      about,
      skills,
      experience,
      ...(avatarUrl && { avatarUrl }),
    };

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Fetch the user's profile
      const profile = await Profile.findOne({ user: userId });
  
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.status(200).json({ profile });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  /**
   * Delete the user's profile.
   */
  exports.deleteProfile = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Find the profile
      const profile = await Profile.findOne({ user: userId });
  
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      // Delete the profile image from S3 if it exists
      if (profile.avatarUrl) {
        const avatarKey = profile.avatarUrl.split('.amazonaws.com/')[1];
  
        await s3
          .deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: avatarKey,
          })
          .promise();
      }
  
      // Delete the profile
      await Profile.deleteOne({ user: userId });
  
      // Optionally delete related data (applications, saved jobs)
      await Application.deleteMany({ user: userId });
      await SavedJob.deleteMany({ user: userId });
  
      res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.applyForJob = (req, res) => {
    
};
