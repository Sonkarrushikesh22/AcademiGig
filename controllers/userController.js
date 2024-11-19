const User = require('../models/User');
const Profile = require('../models/Profile');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const s3Service = require('../services/fileUploadService');  // Import the s3 service for presigned URLs

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
    if (fileType === 'avatar') {
      folder = 'user-profiles';  // Folder for profile images
    } else if (fileType === 'resume') {
      folder = 'user-resumes';  // Folder for resumes
    } else {
      return res.status(400).json({ message: 'Invalid file type. Use "avatar" or "resume".' });
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
exports.getDownloadPresignedUrl = async (req, res) => {
  try {
    const { key, fileType } = req.query;

    // Validate required parameters
    if (!key) {
      return res.status(400).json({ message: 'Missing file key' });
    }

    // Determine the folder based on fileType
    let folder;
    if (fileType === 'avatar') {
      folder = 'user-profiles';
    } else if (fileType === 'resume') {
      folder = 'user-resumes';
    } else {
      folder = ''; // default or handle other file types as needed
    }

    // Generate presigned URL for downloading the file
    const presignedUrl = await s3Service.getObjectURL(`${folder}/${key}`);

    // Return the presigned URL to the client
    res.status(200).json({ presignedUrl });
  } catch (error) {
    console.error('Error generating download presigned URL:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
/**
 * Update the user's profile.
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, location, phone, about, skills, experience, avatarKey, resumeKey } = req.body;

    // Verify user exists before profile creation/update
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updateData = {
      user: userId,
      name,
      location,
      phone,
      about,
      skills,
      experience,
    };

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Handle avatar update
      if (avatarKey) {
        if (profile.avatarKey) {
          await s3Service.deleteFileFromS3(profile.avatarKey);
        }
        updateData.avatarKey = avatarKey;
      }

      // Handle resume update
      if (resumeKey) {
        if (profile.resumeKey) {
          await s3Service.deleteFileFromS3(profile.resumeKey);
        }
        updateData.resumeKey = resumeKey;
      }

      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: userId },
        { $set: updateData },
        { new: true }
      );
    } else {
      // Create new profile for user
      profile = new Profile({
        user: userId,
        name,
        location,
        phone,
        about,
        skills,
        experience,
        avatarKey: avatarKey || null,
        resumeKey: resumeKey || null,
      });
      await profile.save();
    }

    res.status(200).json({ 
      message: profile ? 'Profile updated successfully' : 'Profile created successfully', 
      profile 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
/**
 * Get the user's profile.
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch the user's profile
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Generate presigned URLs for avatar and resume if they exist
    const avatarUrl = profile.avatarKey ? await s3Service.getObjectURL(`user-profiles/${profile.avatarKey}`) : null;
    const resumeUrl = profile.resumeKey ? await s3Service.getObjectURL(`user-resumes/${profile.resumeKey}`) : null;

    res.status(200).json({
      profile,
      avatarUrl,
      resumeUrl
    });
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

    // Delete the avatar and resume from S3 if they exist
    if (profile.avatarKey) {
      await s3Service.deleteFileFromS3(`user-profiles/${profile.avatarKey}`);
    }

    if (profile.resumeKey) {
      await s3Service.deleteFileFromS3(`user-resumes/${profile.resumeKey}`);
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
