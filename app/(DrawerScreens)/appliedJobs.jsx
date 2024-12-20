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

  const transformJobData = (application) => ({
    _id: application.job._id,
    title: application.job.title,
    company: application.job.company,
    jobType: application.job.jobType,
    salary: {
      currency: application.job.salary?.currency,
      min: application.job.salary?.min,
      max: application.job.salary?.max
    },
    location: {
      remote: application.job.location?.remote,
      city: application.job.location?.city,
      state: application.job.location?.state,
      country: application.job.location?.country,
    },
    applicationDeadline: application.job.applicationDeadline,
    skills: application.job.skills,
    experienceLevel: application.job.experienceLevel,
    description: application.job.description,
    requirements: Array.isArray(application.job.requirements) ? application.job.requirements : [],
    responsibilities: Array.isArray(application.job.responsibilities) ? application.job.responsibilities : [],
    logoKey: application.job.companyLogoKey,
    hasApplied: true,
    applicationDate: application.createdAt,
    applicationStatus: application.status
  });

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
      <FlatList  showsVerticalScrollIndicator={false}
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
        contentContainerStyle={{
          paddingBottom: 95, // Always add padding
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal:15,

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