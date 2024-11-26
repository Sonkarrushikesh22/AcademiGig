import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import JobCard from '../../components/CompanyCard/index';
import { getSavedJobs, getDownloadPresignedUrl, unsaveJob, downloadAndCacheLogo } from '../../api/jobsapi';

const Saved = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [logoCache, setLogoCache] = useState({});

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
    description: savedJob.job.description,
    requirements: Array.isArray(savedJob.job.requirements) ? savedJob.job.requirements : [],
    responsibilities: Array.isArray(savedJob.job.responsibilities) ? savedJob.job.responsibilities : [],
    logoKey: savedJob.job.companyLogoKey,
    isSaved: true
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
      
      setSavedJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
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
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  // Handle search
  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = savedJobs.filter((job) =>
        job.title.toLowerCase().includes(text.toLowerCase()) ||
        job.company.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(savedJobs);
    }
  }, [savedJobs]);

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
    }
  };

  // Handle job application
  const handleApply = (job) => {
    console.log('Applying to job:', job._id);
    // Implement your apply logic here
  };

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSavedJobs(true);
  }, [fetchSavedJobs]);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search saved jobs"
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor="#6B7280"
      />

      {loading && !refreshing ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007BFF" />
      ) : (
        <FlatList
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
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    margin: 16,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    color: '#000',
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