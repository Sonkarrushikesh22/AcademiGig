import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet,Alert } from 'react-native';
import JobCard from './index';
import {
  getJobs,
  getDownloadPresignedUrl,
  saveJob,
  unsaveJob,
  isJobSaved,
  downloadAndCacheLogo,
  applyToJob,
  hasAppliedToJob,
  getAppliedJobs
} from '../../api/jobsapi';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [logoCache, setLogoCache] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState(new Set());


  // Load applied jobs
  const loadAppliedJobs = useCallback(async () => {
    try {
      const applied = await getAppliedJobs();
      const appliedIds = new Set(applied.map(app => app.job._id));
      setAppliedJobs(appliedIds);
    } catch (error) {
      console.error('Error loading applied jobs:', error);
    }
  }, []);

  // Update initial useEffect to include loadAppliedJobs
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchJobs(1),
        loadAppliedJobs()
      ]);
    };
    
    initializeData();
  }, [fetchJobs, loadAppliedJobs]);


  // Transform job data to match component expectations
  const transformJobData = useCallback((job) => ({
    _id: job._id,
    title: job.title,
    company: job.company,
    jobType: job.jobType,
    salary: {
      currency: job.salary?.currency,
      min: job.salary?.min,
      max: job.salary?.max
    },
    description: job.description,
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    logoKey: job.companyLogoKey,
    isSaved: false,
    hasApplied: appliedJobs.has(job._id)
  }), [appliedJobs]);

  // Fetch jobs with pagination
  const fetchJobs = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      if (!isRefresh && !isLoadingMore) {
        setLoading(true);
      }
      setError(null);
      
      const response = await getJobs({
        page: pageNum,
        limit: 10,
        sortBy: 'postedDate',
        sortOrder: 'desc'
      });

      // Transform the job data and check saved and applied status
      const transformedJobs = response.jobs.map(transformJobData);
      const [savedStatuses, appliedStatuses] = await Promise.all([
        Promise.all(transformedJobs.map(job => isJobSaved(job._id))),
        Promise.all(transformedJobs.map(job => hasAppliedToJob(job._id)))
      ]);

      // Combine transformed data with saved and applied status
      const jobsWithStatus = transformedJobs.map((job, index) => ({
        ...job,
        isSaved: savedStatuses[index],
        hasApplied: appliedStatuses[index]
      }));

      setJobs(prevJobs => {
        if (isRefresh || pageNum === 1) {
          return jobsWithStatus;
        }
        const existingIds = new Set(prevJobs.map(job => job._id));
        const newJobs = jobsWithStatus.filter(job => !existingIds.has(job._id));
        return [...prevJobs, ...newJobs];
      });

      setHasMore(response.jobs.length === 10);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
      if (isRefresh) {
        setRefreshing(false);
      }
    }
  }, []);

  // Handle job application
  const handleApply = async (job) => {
    try {
      if (job.hasApplied) {
        Alert.alert('Already Applied', 'You have already applied to this job.');
        return;
      }

      const application = await applyToJob(job._id);
      
      // Update both the jobs list and applied jobs set
      setJobs(prevJobs =>
        prevJobs.map(j =>
          j._id === job._id ? { ...j, hasApplied: true } : j
        )
      );
      setAppliedJobs(prev => new Set([...prev, job._id]));

      Alert.alert(
        'Application Submitted',
        'Your job application has been submitted successfully!'
      );
    } catch (error) {
      if (error.message === 'Already applied for this job') {
        // Update the UI to reflect the actual state
        setJobs(prevJobs =>
          prevJobs.map(j =>
            j._id === job._id ? { ...j, hasApplied: true } : j
          )
        );
        setAppliedJobs(prev => new Set([...prev, job._id]));
        
        Alert.alert('Already Applied', 'You have already applied to this job.');
      } else {
        Alert.alert(
          'Application Failed',
          error.message || 'Failed to submit job application. Please try again.'
        );
      }
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  // Handle logo URL caching
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

  // Handle saving/unsaving jobs
  const handleSave = async (job) => {
    try {
      await saveJob(job._id);
      setJobs(prevJobs =>
        prevJobs.map(j =>
          j._id === job._id ? { ...j, isSaved: true } : j
        )
      );
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleUnsave = async (job) => {
    try {
      await unsaveJob(job._id);
      setJobs(prevJobs =>
        prevJobs.map(j =>
          j._id === job._id ? { ...j, isSaved: false } : j
        )
      );
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

 

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await Promise.all([
      fetchJobs(1, true),
      loadAppliedJobs()
    ]);
    setRefreshing(false);
  };

  // Load more jobs when reaching the end
  const handleLoadMore = useCallback(() => {
    if (!loading && !isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchJobs(nextPage);
    }
  }, [loading, isLoadingMore, hasMore, page, fetchJobs]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={jobs}
      renderItem={({ item }) => (
        <JobCard
          key={item._id}
          job={item}
          onSave={handleSave}
          onUnsave={handleUnsave}
          onApply={handleApply}
          getLogoUrl={getLogoUrl}
        />
      )}
      keyExtractor={item => item._id}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      ListFooterComponent={
        (loading || isLoadingMore) && !refreshing ? (
          <ActivityIndicator style={styles.loader} size="large" color="#007BFF" />
        ) : null
      }
      ListEmptyComponent={
        !loading ? (
          <View style={styles.centerContainer}>
            <Text>No jobs found</Text>
          </View>
        ) : null
      }
      contentContainerStyle={jobs.length === 0 ? styles.emptyList : null}
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  loader: {
    padding: 20,
  },
});

export default JobsList;