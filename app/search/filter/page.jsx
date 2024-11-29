import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { filterJobs } from '../../../api/jobsapi';
import JobCard from '../../../components/CompanyCard/index';
import SearchFilter from '../../../components/SearchComponent/SearchFilter';

const FilteredJobsPage = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Convert search params to filter object
  const parseSearchParams = () => {
    const filters = {};
    Object.keys(searchParams).forEach(key => {
      // Convert string values to appropriate types
      if (key === 'minSalary' || key === 'maxSalary') {
        filters[key] = parseInt(searchParams[key]);
      } else if (key === 'isRemote') {
        filters[key] = searchParams[key] === 'true';
      } else if (key === 'skills') {
        filters[key] = searchParams[key].split(',');
      } else {
        filters[key] = searchParams[key];
      }
    });
    return filters;
  };

  const fetchFilteredJobs = useCallback(async (currentPage = 1) => {
    try {
      setIsLoading(true);
      const filters = parseSearchParams();
      
      const result = await filterJobs({
        ...filters,
        page: currentPage,
        limit: 10
      });

      // If it's the first page, replace jobs. Otherwise, append.
      setJobs(prevJobs => 
        currentPage === 1 ? result.jobs : [...prevJobs, ...result.jobs]
      );
      
      setTotalPages(result.totalPages);
      setPage(result.page);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchFilteredJobs();
  }, [fetchFilteredJobs]);

  const loadMoreJobs = () => {
    if (page < totalPages) {
      fetchFilteredJobs(page + 1);
    }
  };

  const renderJobItem = ({ item }) => (
    <JobCard 
      job={item} 
      onSave={() => {/* Implement save logic */}}
      onUnsave={() => {/* Implement unsave logic */}}
      onApply={() => {/* Implement apply logic */}}
      getLogoUrl={() => {/* Implement logo fetching */}}
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => fetchFilteredJobs()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filtered Jobs</Text>
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
          <MaterialIcons name="filter-list" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {jobs.length === 0 && !isLoading ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No jobs found matching your filters</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReached={loadMoreJobs}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {isFilterModalVisible && (
        <View style={styles.filterModalOverlay}>
          <SearchFilter
            initialFilters={parseSearchParams()}
            onClose={() => setIsFilterModalVisible(false)}
            onApplyFilters={() => setIsFilterModalVisible(false)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    marginBottom: 15,
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
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
  filterModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
});

export default FilteredJobsPage;