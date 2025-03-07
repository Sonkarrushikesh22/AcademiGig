
import axios from 'axios';
import API from './api';
import * as FileSystem from 'expo-file-system';

// Fetch user profile
export const getUserProfile = async () => {
  try {
    const response = await API.get('/user/getprofile');
    const profileData = response.data.profile || {};
    
    if (response.status === 404) {
      return {
        name: '',
        location: '',
        phone: '',
        about: '',
        skills: [],
        experience: [],
        avatarUrl: null,
        resumeUrl: null,
      };
    }

    return {
      name: profileData.name || '',
      location: profileData.location || '',
      phone: profileData.phone || '',
      about: profileData.about || '',
      skills: profileData.skills || [],
      experience: profileData.experience || [],
      avatarUrl: response.data.avatarUrl || null,
      resumeUrl: response.data.resumeUrl || null,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      // Return default empty profile instead of throwing error
      return {
        name: '',
        location: '',
        phone: '',
        about: '',
        skills: [],
        experience: [],
        avatarUrl: null,
        resumeUrl: null,
      };
    }
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw new Error('Failed to fetch profile data');
  }
};

// Update profile
export const updateProfile = async (profileData) => {
  if (!profileData || typeof profileData !== 'object') {
    throw new Error('Invalid profile data');
  }

  try {
    const response = await API.put('/user/updateprofile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    throw new Error('Failed to update profile');
  }
};

// Get presigned URL for upload
export const getPresignedUrl = async (fileType, filename, contentType) => {
  if (!fileType || !filename || !contentType) {
    throw new Error('Missing required parameters for presigned URL');
  }

  try {
    const response = await API.get('/user/get-upload-presigned-url', {
      params: { fileType, filename, contentType }
    });
    
    if (!response.data?.presignedUrl) {
      throw new Error('No presigned URL received from server');
    }
    
    return response.data.presignedUrl;
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw new Error('Failed to get upload URL');
  }
};

// Get download presigned URL
export const getDownloadPresignedUrl = async (key, fileType) => {
  if (!key || !fileType) {
    throw new Error('Missing required parameters for download URL');
  }

  try {
    const response = await API.get('/user/get-download-url', {
      params: { key, fileType }
    });

    if (!response.data?.presignedUrl) {
      throw new Error('No presigned download URL received from server');
    }

    return response.data.presignedUrl;
  } catch (error) {
    console.error('Error getting download presigned URL:', error);
    throw new Error('Failed to get download URL');
  }
};

// Helper function to get file info from URI
const getFileInfo = async (uri) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }
    return fileInfo;
  } catch (error) {
    console.error('Error getting file info:', error);
    throw new Error('Failed to access file');
  }
};

// Upload file to S3
export const uploadFileToS3 = async (presignedUrl, file, contentType) => {
  try {
    // Validate inputs
    if (!presignedUrl || !file || !contentType) {
      throw new Error('Missing required parameters for upload');
    }

    // Get file info and validate
    const fileInfo = await getFileInfo(file.uri);
    console.log('File info:', fileInfo);

    // Upload using FileSystem
    const uploadResult = await FileSystem.uploadAsync(presignedUrl, file.uri, {
      httpMethod: 'PUT',
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        'Content-Type': contentType,
      },
    });

    if (uploadResult.status !== 200) {
      throw new Error(`Upload failed with status ${uploadResult.status}`);
    }

    const urlParts = presignedUrl.split('?')[0];

    // Use a regular expression to dynamically extract the folder and key
    const match = urlParts.match(/\/(user-profiles|user-resumes)\/(.+)/);
    if (!match) {
      throw new Error('Unable to extract the key from the presigned URL');
    }
    
    const folder = match[1]; // This will be either 'user-profiles' or 'user-resumes'
    const key = match[2];    // This is the actual key after the folder
    
    return {
      url: presignedUrl.split('?')[0],
      folder: folder, // Include the folder for clarity if needed
      key: key,       // Return the extracted key
    };
  } catch (error) {
    console.error('Error in uploadFileToS3:', error);
    throw new Error('Failed to upload file');
  }
};

// Helper function to validate file size
export const validateFileSize = async (uri, maxSizeMB = 5) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const fileSizeMB = fileInfo.size / (1024 * 1024);
    return fileSizeMB <= maxSizeMB;
  } catch (error) {
    console.error('Error validating file size:', error);
    return false;
  }
};


