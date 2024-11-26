import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import JobCard from '../../components/CompanyCard/index';
import { 
  getAppliedJobs, 
  getDownloadPresignedUrl, 
  downloadAndCacheLogo,
  saveJob,
  unsaveJob,
  isJobSaved
} from '../../api/jobsapi';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [logoCache, setLogoCache] = useState({});
  const navigation = useNavigation();

  const fetchAppliedJobs = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);

      const jobs = await getAppliedJobs();
      
      // Check saved status for each job
      const jobsWithSavedStatus = await Promise.all(
        jobs.map(async (application) => {
          const isSaved = await isJobSaved(application.job._id);
          return {
            ...application.job,
            hasApplied: true,
            isSaved: isSaved,
            applicationDate: application.createdAt,
            applicationStatus: application.status,
            logoKey: application.job.companyLogoKey,
          };
        })
      );

      setAppliedJobs(jobsWithSavedStatus);
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

  const handleSave = async (job) => {
    try {
      await saveJob(job._id);
      setAppliedJobs(prevJobs =>
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
      setAppliedJobs(prevJobs =>
        prevJobs.map(j =>
          j._id === job._id ? { ...j, isSaved: false } : j
        )
      );
    } catch (error) {
      console.error('Error unsaving job:', error);
      Alert.alert('Error', 'Failed to unsave job');
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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.header}>Applied Jobs</Text>
      </View>
      <FlatList
        data={appliedJobs}
        renderItem={({ item }) => (
          <JobCard
            key={item._id}
            job={item}
            onSave={() => handleSave(item)}
            onUnsave={() => handleUnsave(item)}
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginTop:20
  },
  header: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
   marginLeft: -18,
    textAlign: 'center',
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
  },
});

export default AppliedJobs;