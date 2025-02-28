import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar
} from 'react-native';
import JobCard from '../../components/CompanyCard/index';
import { 
  getSavedJobs, 
  getDownloadPresignedUrl, 
  unsaveJob, 
  downloadAndCacheLogo,
  applyToJob,
  hasAppliedToJob,
  getAppliedJobs
} from '../../api/jobsapi';

const CustomHeader = ({ title }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
  </View>
);

const Saved = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [logoCache, setLogoCache] = useState({});
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

  // Transform saved job data to match JobCard component expectations
  const transformJobData = (savedJob) => ({
    _id: savedJob.job._id,
    title: savedJob.job.title,
    company: savedJob.job.company,
    jobType: savedJob.job.jobType,
    salary: {
      currency: savedJob.job.salary?.currency || 'Salary not specified',
      min: savedJob.job.salary?.min,
      max: savedJob.job.salary?.max
    },
    location: {
      remote: savedJob.job.location?.remote,
      city: savedJob.job.location?.city,
      state: savedJob.job.location?.state,
      country: savedJob.job.location?.country,
    },
    applicationDeadline: savedJob.job.applicationDeadline,
    skills: savedJob.job.skills,
    experienceLevel: savedJob.job.experienceLevel,
    description: savedJob.job.description,
    requirements: Array.isArray(savedJob.job.requirements) ? savedJob.job.requirements : [],
    responsibilities: Array.isArray(savedJob.job.responsibilities) ? savedJob.job.responsibilities : [],
    logoKey: savedJob.job.companyLogoKey,
    isSaved: true,
    hasApplied: appliedJobs.has(savedJob.job._id)
  });

  // Fetch saved jobs
  const fetchSavedJobs = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);
  
      const response = await getSavedJobs();
      const transformedJobs = response.map(transformJobData);
      
      // Check applied status for each job
      const appliedStatuses = await Promise.all(
        transformedJobs.map(job => hasAppliedToJob(job._id))
      );
  
      const jobsWithAppliedStatus = transformedJobs.map((job, index) => ({
        ...job,
        hasApplied: appliedStatuses[index]
      }));
  
      setSavedJobs(jobsWithAppliedStatus);
      setFilteredJobs(jobsWithAppliedStatus);
    } catch (err) {
      setError('Failed to load saved jobs. Please try again.');
      console.error('Error fetching saved jobs:', err);
    } finally {
      setLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    const initializeData = async () => {
      await loadAppliedJobs();
      await fetchSavedJobs();
    };
    
    initializeData();
  }, []); 

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

  // Handle unsaving jobs
  const handleUnsave = async (job) => {
    try {
      await unsaveJob(job._id);
      setSavedJobs(prevJobs => prevJobs.filter(j => j._id !== job._id));
      setFilteredJobs(prevJobs => prevJobs.filter(j => j._id !== job._id));
    } catch (error) {
      console.error('Error unsaving job:', error);
      Alert.alert('Error', 'Failed to unsave job. Please try again.');
    }
  };

  // Handle job application
  const handleApply = async (job) => {
    try {
      if (job.hasApplied) {
        Alert.alert('Already Applied', 'You have already applied to this job.');
        return;
      }

      await applyToJob(job._id);
      
      // Update both savedJobs and filteredJobs lists
      const updateJobs = (jobs) => jobs.map(j =>
        j._id === job._id ? { ...j, hasApplied: true } : j
      );

      setSavedJobs(updateJobs);
      setFilteredJobs(updateJobs);
      setAppliedJobs(prev => new Set([...prev, job._id]));

      Alert.alert(
        'Application Submitted',
        'Your job application has been submitted successfully!'
      );
    } catch (error) {
      if (error.message === 'Already applied for this job') {
        // Update the UI to reflect the actual state
        const updateJobs = (jobs) => jobs.map(j =>
          j._id === job._id ? { ...j, hasApplied: true } : j
        );

        setSavedJobs(updateJobs);
        setFilteredJobs(updateJobs);
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

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      loadAppliedJobs(),
      fetchSavedJobs(true)
    ]);
  }, [loadAppliedJobs, fetchSavedJobs]);

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'dark-content'} />
      <View style={styles.container}>
        <CustomHeader title="Saved"/>

        {loading && !refreshing ? (
          <ActivityIndicator style={styles.loader} size="large" color="#007BFF" />
        ) : (
          <FlatList  
            showsVerticalScrollIndicator={false}
            data={filteredJobs}
            renderItem={({ item }) => (
              <JobCard
                key={item._id}
                job={item}
                onSave={() => {}} // Empty function since job is already saved
                onUnsave={handleUnsave}
                onApply={handleApply}
                getLogoUrl={getLogoUrl}
              />
            )}
            keyExtractor={item => item._id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#007BFF']}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery 
                    ? 'No saved jobs match your search'
                    : 'No saved jobs yet'}
                </Text>
              </View>
            }
            contentContainerStyle={{
              paddingBottom: 95, // Always add padding
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    //backgroundColor: '#fff',
    // Platform specific styling for the safe area
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    ...Platform.select({
      ios: {
        marginBottom:-30
      },
    }),

  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    // Platform specific margin for header
    //marginTop: Platform.OS === 'ios' ? 0 : 0,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Saved;