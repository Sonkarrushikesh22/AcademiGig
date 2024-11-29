import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import JobCard from '../../components/CompanyCard/index';
import { 
  getJobsByCategory, 
  getDownloadPresignedUrl,
  downloadAndCacheLogo,
  saveJob,
  unsaveJob,
  applyToJob,
  hasAppliedToJob,
  getAppliedJobs,
  getSavedJobs,
  isJobSaved
} from '../../api/jobsapi';

const JobsByCategory = () => {
  const router = useRouter();
  const { category, categoryKey } = useLocalSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [logoCache, setLogoCache] = useState({});
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  const transformJobData = useCallback((job) => ({
    _id: job._id,
    title: job.title,
    company: job.company,
    jobType: job.jobType,
    salary: {
      currency: job.salary?.currency || 'Salary not specified',
      min: job.salary?.min,
      max: job.salary?.max
    },
    location: {
      remote: job.location?.remote,
      city: job.location?.city,
      state: job.location?.state,
      country: job.location?.country,
    },
    applicationDeadline: job.applicationDeadline,
    skills: job.skills,
    experienceLevel: job.experienceLevel,
    description: job.description,
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
    logoKey: job.companyLogoKey,
    isSaved: savedJobIds.has(job._id),
    hasApplied: appliedJobs.has(job._id)
  }), [savedJobIds, appliedJobs]);

  const loadSavedAndAppliedJobs = useCallback(async () => {
    try {
      const [saved, applied] = await Promise.all([
        getSavedJobs(),
        getAppliedJobs()
      ]);
      setSavedJobIds(new Set(saved.map(item => item.job._id)));
      setAppliedJobs(new Set(applied.map(app => app.job._id)));
    } catch (error) {
      console.error('Error loading saved/applied jobs:', error);
    }
  }, []);

  useEffect(() => {
    if (categoryKey) {
      loadSavedAndAppliedJobs();
      fetchJobsByCategory();
    }
  }, [page, categoryKey]);

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

  const fetchJobsByCategory = async () => {
    try {
      setLoading(true);
      const result = await getJobsByCategory({
        category: categoryKey,
        page,
        limit: 10,
      });

      // Check saved status for each job
      const jobsWithStatus = await Promise.all(
        result.jobs.map(async (job) => {
          const isSaved = await isJobSaved(job._id);
          return {
            ...transformJobData(job),
            isSaved
          };
        })
      );

      setJobs(prevJobs => 
        page === 1 ? jobsWithStatus : [...prevJobs, ...jobsWithStatus]
      );
      setTotal(result.total);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add isJobSaved to imports
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
      Alert.alert('Error', 'Failed to save job');
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
      Alert.alert('Error', 'Failed to unsave job');
    }
  };

  const handleApply = async (job) => {
    try {
      if (job.hasApplied) {
        Alert.alert('Already Applied', 'You have already applied to this job.');
        return;
      }

      await applyToJob(job._id);
      setAppliedJobs(prev => new Set([...prev, job._id]));
      setJobs(prevJobs => prevJobs.map(j => 
        j._id === job._id ? { ...j, hasApplied: true } : j
      ));

      Alert.alert(
        'Application Submitted',
        'Your job application has been submitted successfully!'
      );
    } catch (error) {
      if (error.message === 'Already applied for this job') {
        setAppliedJobs(prev => new Set([...prev, job._id]));
        setJobs(prevJobs => prevJobs.map(j => 
          j._id === job._id ? { ...j, hasApplied: true } : j
        ));
        Alert.alert('Already Applied', 'You have already applied to this job.');
      } else {
        Alert.alert(
          'Application Failed',
          error.message || 'Failed to submit job application. Please try again.'
        );
      }
    }
  };

  const handleLoadMore = () => {
    if (jobs.length < total) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderJobItem = ({ item }) => (
    <JobCard
      job={item}
      onPress={() => router.push(`/job-details/${item._id}`)}
      onSave={handleSave}
      onUnsave={handleUnsave}
      onApply={handleApply}
      getLogoUrl={getLogoUrl}
    />
  );

  if (!category || !categoryKey) {
    return (
      <SafeAreaView>
        <Text>Error: Missing category or categoryKey</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 15 }}>
        {loading && jobs.length === 0 ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={jobs}
            renderItem={renderJobItem}
            keyExtractor={item => item._id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 50 }}>
                No jobs found in this category
              </Text>
            }
            contentContainerStyle={{
              paddingBottom: 95, 
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default JobsByCategory;