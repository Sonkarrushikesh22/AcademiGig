import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl } from 'react-native';
import JobCard from '../../components/CompanyCard/index';
import { getAppliedJobs, getDownloadPresignedUrl, downloadAndCacheLogo } from '../../api/jobsapi';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [logoCache, setLogoCache] = useState({});

  const fetchAppliedJobs = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);

      const jobs = await getAppliedJobs();
      
      // Transform the jobs data to match the JobCard component expectations
      const transformedJobs = jobs.map(application => ({
        ...application.job,
        hasApplied: true,
        isSaved: false, // You might want to check the saved status if needed
        applicationDate: application.createdAt,
        applicationStatus: application.status,
        logoKey: application.job.companyLogoKey,
            }));

      setAppliedJobs(transformedJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const getLogoUrl = async (logoKey) => {
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
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppliedJobs(true);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Applied Jobs</Text>
      <FlatList
        data={appliedJobs}
        renderItem={({ item }) => (
          <JobCard
            key={item._id}
            job={item}
            onSave={() => {}} // Implement if needed
            onUnsave={() => {}} // Implement if needed
            onApply={() => {}} // Already applied, so this is empty
            getLogoUrl={getLogoUrl}
          />
        )}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No applied jobs found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default AppliedJobs;