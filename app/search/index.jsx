import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { filterJobs } from '../../api/jobsapi';
import JobCard from '../../components/CompanyCard/index';
import SearchInput from '../../components/SearchComponent/SearchInput';
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

  const handleSearchResults = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      
      // Don't destructure the filters - keep them intact
      console.log('Received filters:', filters);

      // Update search query if changed
      if (filters.search !== searchQuery) {
        setSearchQuery(filters.search || '');
      }

      // Keep track of active filters
      setActiveFilters(filters);

      console.log('Sending filters to API:', filters);

      // Pass the filters directly to filterJobs
      const results = await filterJobs(filters);
  
      setJobs(results.jobs || []);
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
      
      console.log('Loading more jobs with:', {
        ...activeFilters,
        search: searchQuery,
        page: page + 1,
        limit: 10
      });

      const results = await filterJobs({
        ...activeFilters,
        search: searchQuery,
        page: page + 1,
        limit: 10
      });

      setJobs(prevJobs => [...prevJobs, ...(results.jobs || [])]);
      setPage(results.page || page + 1);
    } catch (err) {
      console.error('Load more error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  
  useEffect(() => {
    const fetchInitialJobs = async () => {
      try {
        setIsLoading(true);
        
        // Convert URL params to filters
        const initialFilters = {};
        Object.entries(route || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            initialFilters[key] = value;
          }
        });
  
        // Only fetch if there are actual filters and they're different from current active filters
        const filtersChanged = Object.keys(initialFilters).some(
          key => initialFilters[key] !== activeFilters[key]
        );
  
        if (filtersChanged) {
          const results = await filterJobs(initialFilters);
      
          setJobs(results.jobs || []);
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

  const renderJobItem = ({ item }) => (
    <JobCard 
      job={item}
      onPress={() => router.push(`/job/${item.id}`)}
      onSave={() => {/* Implement save functionality */}}
      onUnsave={() => {/* Implement unsave functionality */}}
      onApply={() => router.push(`/job/${item.id}/apply`)}
    />
  );

  // const renderHeader = () => (
  //   <View style={styles.headerContent}>
  //     <SearchInput 
  //       initialSearch={searchQuery}
  //       onSearchResults={handleSearchResults}
  //     />
  //     {totalResults > 0 && (
  //       <Text style={styles.resultsCount}>
  //         {totalResults} job{totalResults !== 1 ? 's' : ''} found
  //       </Text>
  //     )}
  //   </View>
  // );

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
          onPress={() => handleSearchResults([])}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleRetry = () => {
    handleSearchResults({
      ...activeFilters,
      search: searchQuery
    });
  };

  // In your error view:
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
          item.id?.toString() || `job-${index}-${item.title || 'unknown'}`
        }
        onEndReached={loadMoreJobs}
        onEndReachedThreshold={0.5}
     //   ListHeaderComponent={renderHeader}
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