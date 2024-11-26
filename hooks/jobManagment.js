import { useState, useEffect, useCallback } from 'react';
import { 
  getJobs, 
  saveJob, 
  unsaveJob, 
  applyToJob, 
  getAppliedJobs, 
  getSavedJobs,
  getDownloadPresignedUrl,
  downloadAndCacheLogo,
  isJobSaved,
  hasAppliedToJob
} from '../api/jobsapi';

const useJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [logoCache, setLogoCache] = useState({});
  const [loading, setLoading] = useState(true);

  // Unified job data transformation
  const transformJob = useCallback((job, options = {}) => {
    const { checkSaved = false, checkApplied = false } = options;
    
    return {
      ...job,
      isSaved: checkSaved ? isJobSaved(job._id) : false,
      hasApplied: checkApplied ? hasAppliedToJob(job._id) : false
    };
  }, []);
  // Centralized logo fetching
  const getLogoUrl = useCallback(async (logoKey) => {
    if (!logoKey) return { type: 'placeholder' };
    
    try {
      if (logoCache[logoKey]) {
        return { type: 'file', path: logoCache[logoKey] };
      }
  
      const presignedUrl = await getDownloadPresignedUrl(logoKey, 'job-logo');
      const result = await downloadAndCacheLogo(presignedUrl, logoKey);
      
      if (result.type === 'file') {
        setLogoCache(prev => ({
          ...prev,
          [logoKey]: result.path
        }));
      }
  
      return result;
    } catch (error) {
      console.warn('Error getting logo URL:', error);
      return { type: 'placeholder' };
    }
  }, [logoCache]);

  // Unified job fetching
  const fetchJobs = useCallback(async (options = {}) => {
    const { 
      page: requestedPage = page, 
      limit = 10, 
      search = '' 
    } = options;
    
    if (!hasMore && requestedPage > page) return;

    try {
      setLoading(true);
      const response = await getJobs({ 
        page: requestedPage, 
        limit, 
        search 
      });
      
      const transformedJobs = await Promise.all(
        response.jobs.map(job => transformJob(job, { 
          checkSaved: true, 
          checkApplied: true 
        }))
      );

      // Append or replace jobs based on page number
      setJobs(prev => 
        requestedPage === 1 
          ? transformedJobs 
          : [...prev, ...transformedJobs]
      );

      setPage(requestedPage);
      setHasMore(response.jobs.length === limit);
    } catch (error) {
      console.error('Job fetching error:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, transformJob]);

  useEffect(() => {
    fetchJobs({ page: 1 });
  }, []);

  useEffect(() => {
    const loadAdditionalData = async () => {
      try {
        const [savedResponse, appliedResponse] = await Promise.all([
          getSavedJobs(),
          getAppliedJobs()
        ]);
        
        setSavedJobs(savedResponse);
        setAppliedJobs(appliedResponse);
      } catch (error) {
        console.error('Additional data loading error:', error);
      }
    };

    loadAdditionalData();
  }, []);

  // Save/Unsave job
  const handleJobSave = useCallback(async (job) => {
    try {
      await (job.isSaved ? unsaveJob : saveJob)(job._id);
      
      setJobs(prev => prev.map(j => 
        j._id === job._id ? { ...j, isSaved: !j.isSaved } : j
      ));
    } catch (error) {
      console.error('Save/Unsave error:', error);
    }
  }, []);

  // Apply to job
  const handleJobApply = useCallback(async (job) => {
    try {
      await applyToJob(job._id);
      
      setJobs(prev => prev.map(j => 
        j._id === job._id ? { ...j, hasApplied: true } : j
      ));
    } catch (error) {
      console.error('Job application error:', error);
    }
  }, []);

 
  return {
    jobs,
    savedJobs,
    appliedJobs,
    loading,
    getLogoUrl,
    fetchJobs,
    handleJobSave,
    handleJobApply,
    hasMore,
    page
  };
};

export default useJobManagement;