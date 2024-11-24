import axios from 'axios';
import API from './api';
import * as FileSystem from 'expo-file-system';

/**
 * @typedef {Object} JobLocation
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {boolean} remote
 */

/**
 * @typedef {Object} Job
 * @property {string} _id
 * @property {string} title
 * @property {string} description
 * @property {string} company
 * @property {string} category
 * @property {string} jobType
 * @property {string} experienceLevel
 * @property {JobLocation} location
 * @property {string} companyLogoKey
 * @property {string} companyLogoUrl
 * @property {Date} postedDate
 */

/**
 * @typedef {Object} SavedJob
 * @property {string} _id
 * @property {Job} job
 * @property {string} user
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} JobsResponse
 * @property {Job[]} jobs
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 */

/**
 * Get all jobs with filtering, pagination, and sorting
 * @param {Object} params
 * @param {string} [params.search] - Search term for title and description
 * @param {string} [params.category] - Job category
 * @param {string} [params.jobType] - Type of job
 * @param {string} [params.experienceLevel] - Required experience level
 * @param {string} [params.location] - Location search term
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page
 * @param {string} [params.sortBy='postedDate'] - Field to sort by
 * @param {string} [params.sortOrder='desc'] - Sort order ('asc' or 'desc')
 * @returns {Promise<JobsResponse>}
 */
export const getJobs = async ({
  search,
  category,
  jobType,
  experienceLevel,
  location,
  page = 1,
  limit = 10,
  sortBy = 'postedDate',
  sortOrder = 'desc'
} = {}) => {
  try {
    const response = await API.get('/job/get-all-jobs', {
      params: {
        search,
        category,
        jobType,
        experienceLevel,
        location,
        page,
        limit,
        sortBy,
        sortOrder
      }
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch jobs');
    }

    return {
      jobs: response.data.jobs || [],
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
  }
};

/**
 * Get detailed information about a specific job
 * @param {string} jobId - The ID of the job
 * @returns {Promise<Job>}
 */
export const getJobDetails = async (jobId) => {
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  try {
    const response = await API.get(`/job/get-job-details/${jobId}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch job details');
    }

    return response.data.job;
  } catch (error) {
    console.error('Error fetching job details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch job details');
  }
};

/**
 * Get presigned URL for downloading files
 * @param {string} key - S3 object key
 * @param {string} fileType - Type of file (must be 'job-logo')
 * @returns {Promise<string>}
 */
export const getDownloadPresignedUrl = async (key, fileType = 'job-logo') => {
  if (!key) {
    throw new Error('File key is required');
  }

  try {
    const response = await API.get('/job/logo-download-url', {
      params: { key, fileType }
    });

    if (!response.data.presignedUrl) {
      throw new Error('No presigned download URL received from server');
    }

    return response.data.presignedUrl;
  } catch (error) {
    console.error('Error getting download presigned URL:', error);
    throw new Error('Failed to get download URL');
  }
};

/**
 * Fetch all saved jobs for the current user
 * @returns {Promise<SavedJob[]>}
 */
export const getSavedJobs = async () => {
  try {
    const response = await API.get('/saved-jobs/get');
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch saved jobs'
    );
  }
};

/**
 * Save a job for the current user
 * @param {string} jobId - The ID of the job to save
 * @returns {Promise<SavedJob>}
 */
export const saveJob = async (jobId) => {
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  try {
    const response = await API.post('/saved-jobs/save', {
      jobId
    });

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Job is already saved');
    }
    if (error.response?.status === 404) {
      throw new Error('Job not found');
    }

    console.error('Error saving job:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to save job'
    );
  }
};

/**
 * Remove a saved job for the current user
 * @param {string} jobId - The ID of the saved job to remove
 * @returns {Promise<void>}
 */
export const unsaveJob = async (jobId) => {
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  try {
    await API.delete(`/saved-jobs/delete/${jobId}`);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Saved job not found');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid job ID format');
    }

    console.error('Error removing saved job:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to remove saved job'
    );
  }
};

/**
 * Check if a job is saved for the current user
 * @param {string} jobId - The ID of the job to check
 * @returns {Promise<boolean>}
 */
export const isJobSaved = async (jobId) => {
  try {
    const savedJobs = await getSavedJobs();
    return savedJobs.some(savedJob => savedJob.job._id === jobId);
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return false;
  }
};



/**
 * Download and cache a company logo
 * @param {string} url - URL of the logo
 * @param {string} filename - Filename to save as
 * @returns {Promise<{type: 'file'|'placeholder', path?: string}>} - Result object with type and path
 */
export const downloadAndCacheLogo = async (url, filename) => {
    try {
      // Validate URL
      if (!url || !url.trim()) {
        console.warn('Invalid or empty URL provided');
        return { type: 'placeholder' };
      }
  
      // Validate URL format
      try {
        new URL(url);
      } catch (e) {
        console.warn('Malformed URL:', url);
        return { type: 'placeholder' };
      }
  
      // Ensure filename is valid
      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const logoCacheDir = `${FileSystem.cacheDirectory}logos/`;
      const filePath = `${logoCacheDir}${sanitizedFilename}`;
  
      // Create directory if needed
      const dirInfo = await FileSystem.getInfoAsync(logoCacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(logoCacheDir, { intermediates: true });
      }
  
      // Check for existing cached file
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        const stats = await FileSystem.getInfoAsync(filePath, { md5: false });
        const fileAge = Date.now() - stats.modificationTime;
        const ONE_DAY = 24 * 60 * 60 * 1000;
  
        if (fileAge < ONE_DAY) {
          return { type: 'file', path: filePath };
        }
      }
  
      // Attempt download with detailed error logging
      try {
        console.log('Attempting to download from:', url);
        const downloadResult = await FileSystem.downloadAsync(url, filePath);
        
        if (downloadResult.status === 404) {
          console.warn('Logo URL not found:', url);
          return { type: 'placeholder' };
        }
        
        if (downloadResult.status !== 200) {
          console.warn(`Failed to download logo: HTTP ${downloadResult.status}`, url);
          return { type: 'placeholder' };
        }
  
        return { type: 'file', path: filePath };
      } catch (downloadError) {
        console.error('Download failed:', {
          url,
          error: downloadError.message,
          status: downloadError.status
        });
        return { type: 'placeholder' };
      }
  
    } catch (error) {
      console.error('Error in downloadAndCacheLogo:', {
        url,
        error: error.message,
        filename: filename
      });
      return { type: 'placeholder' };
    }
  };


  /**
 * @typedef {Object} JobApplication
 * @property {string} _id
 * @property {string} user
 * @property {Job} job
 * @property {string} status
 * @property {string} resumeUrl
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Apply to a job
 * @param {string} jobId - The ID of the job to apply for
 * @returns {Promise<JobApplication>}
 */
// In your frontend jobsapi.js
export const applyToJob = async (jobId) => {
    if (!jobId) {
      throw new Error('Job ID is required');
    }
  
    try {
      const response = await API.post('/application/apply', {
        jobId
      });
  
      if (!response.data) {
        throw new Error('No data received from server');
      }
  
      return response.data.application;
    } catch (error) {
      if (error.response?.status === 400) {
        if (error.response.data.message.includes('profile')) {
          throw new Error('Please complete your profile before applying to jobs');
        }
        throw new Error('Already applied for this job');
      }
      if (error.response?.status === 404) {
        throw new Error('Job not found');
      }
  
      console.error('Error applying to job:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to submit job application'
      );
    }
};
  
/**
 * @typedef {Object} AppliedJob
 * @property {Job} job - The job details
 * @property {string} applicationId - ID of the application
 * @property {string} status - Status of the application
 * @property {Date} appliedDate - Date when user applied
 */

/**
 * Get all jobs that the current user has applied to
 * @returns {Promise<AppliedJob[]>}
 */
export const getAppliedJobs = async () => {
    try {
      const response = await API.get('/application/applied-jobs');
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch applied jobs');
      }
  
      return response.data.appliedJobs;
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to fetch applied jobs'
      );
    }
  };
  
  /**
   * Check if user has already applied to a specific job
   * @param {string} jobId - The ID of the job to check
   * @returns {Promise<boolean>}
   */
  export const hasAppliedToJob = async (jobId) => {
    try {
      const appliedJobs = await getAppliedJobs();
      return appliedJobs.some(application => application.job._id === jobId);
    } catch (error) {
      console.error('Error checking job application status:', error);
      return false;
    }
  };
  
