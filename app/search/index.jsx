import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  filterJobs,
  saveJob,
  unsaveJob,
  isJobSaved,
  applyToJob,
  hasAppliedToJob,
  getDownloadPresignedUrl, 
  downloadAndCacheLogo 
} from '../../api/jobsapi';
import JobCard from '../../components/CompanyCard/index';
import { useLocalSearchParams } from 'expo-router';

const JobsSearchPage = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [totalResults, setTotalResults] = useState(0);
  const route = useLocalSearchParams();
  const [logoCache, setLogoCache] = useState({});

  useEffect(() => {
    const fetchInitialJobs = async () => {
      try {
        setIsLoading(true);
        
        const initialFilters = {};
        Object.entries(route || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            initialFilters[key] = value;
          }
        });
  
        const filtersChanged = Object.keys(initialFilters).some(
          key => initialFilters[key] !== activeFilters[key]
        );
  
        if (filtersChanged) {
          const results = await filterJobs(initialFilters);
      
          const jobsWithStatus = await Promise.all(
            (results.jobs || []).map(async (job) => {
              const [isSaved, hasApplied] = await Promise.all([
                isJobSaved(job._id),
                hasAppliedToJob(job._id)
              ]);
              return { ...job, isSaved, hasApplied };
            })
          );

          setJobs(jobsWithStatus);
          setTotalPages(results.totalPages || 0);
          setPage(results.currentPage || 1);
          setTotalResults(results.totalJobs || 0);
          setSearchQuery(initialFilters.search || '');
          setActiveFilters(initialFilters);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchInitialJobs();
  }, [route, JSON.stringify(activeFilters)]);

  const handleSearchResults = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      console.log('Received filters:', filters);

      if (filters.search !== searchQuery) {
        setSearchQuery(filters.search || '');
      }

      setActiveFilters(filters);
      const results = await filterJobs(filters);
      
      const jobsWithStatus = await Promise.all(
        (results.jobs || []).map(async (job) => {
          const [isSaved, hasApplied] = await Promise.all([
            isJobSaved(job._id),
            hasAppliedToJob(job._id)
          ]);
          return { ...job, isSaved, hasApplied };
        })
      );
  
      setJobs(jobsWithStatus);
      setTotalPages(results.totalPages || 0);
      setPage(1);
      setTotalResults(results.totalJobs || 0);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const loadMoreJobs = async () => {
    if (isLoading || page >= totalPages) return;

    try {
      setIsLoading(true);
      const results = await filterJobs({
        ...activeFilters,
        search: searchQuery,
        page: page + 1,
        limit: 10
      });

      const newJobsWithStatus = await Promise.all(
        (results.jobs || []).map(async (job) => {
          const [isSaved, hasApplied] = await Promise.all([
            isJobSaved(job._id),
            hasAppliedToJob(job._id)
          ]);
          return { ...job, isSaved, hasApplied };
        })
      );

      setJobs(prevJobs => [...prevJobs, ...newJobsWithStatus]);
      setPage(results.page || page + 1);
    } catch (err) {
      console.error('Load more error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      setJobs(prevJobs =>
        prevJobs.map(j =>
          j._id === job._id ? { ...j, hasApplied: true } : j
        )
      );

      Alert.alert(
        'Application Submitted',
        'Your job application has been submitted successfully!'
      );
    } catch (error) {
      if (error.message === 'Already applied for this job') {
        setJobs(prevJobs =>
          prevJobs.map(j =>
            j._id === job._id ? { ...j, hasApplied: true } : j
          )
        );
        Alert.alert('Already Applied', 'You have already applied to this job.');
      } else {
        Alert.alert(
          'Application Failed',
          error.message || 'Failed to submit job application. Please try again.'
        );
      }
    }
  };

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

  const renderJobItem = ({ item }) => (
    <JobCard 
      job={
        {
          ...item,
          logoKey: item.companyLogoKey // Add this line
        }
      }
      onPress={() => router.push(`/job/${item._id}`)}
      onSave={() => handleSave(item)}
      onUnsave={() => handleUnsave(item)}
      onApply={() => handleApply(item)}
      getLogoUrl={getLogoUrl}
    />
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="search-off" size={48} color="#666" />
      <Text style={styles.emptyText}>
        {searchQuery 
          ? "No jobs found matching your search" 
          : "Start searching for jobs"}
      </Text>
      {searchQuery && (
        <Text style={styles.emptySubtext}>
          Try adjusting your search or filters
        </Text>
      )}
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="red" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item, index) => 
          item._id?.toString() || `job-${index}-${item.title || 'unknown'}`
        }
        onEndReached={loadMoreJobs}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContainer,
          jobs.length === 0 && styles.emptyList
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsCount: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginVertical: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default JobsSearchPage;