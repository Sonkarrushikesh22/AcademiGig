import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';

const JobCard = ({ 
  job,
  onApply 
}) => {
  // Format salary range
  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Salary not specified';
    if (!max) return `${currency}${min.toLocaleString()}+`;
    if (!min) return `Up to ${currency}${max.toLocaleString()}`;
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  // Format date
  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy');
  };

  // Get days remaining until deadline
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Image 
            source={{ uri: job.companyLogoUrl || 'https://via.placeholder.com/50' }}
            style={styles.logo}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
            <Text style={styles.companyName}>{job.company}</Text>
          </View>
        </View>
        <View style={styles.tagContainer}>
          <View style={[styles.tag, styles.jobTypeTag]}>
            <Text style={styles.jobTypeText}>{job.jobType}</Text>
          </View>
          {job.location.remote && (
            <View style={[styles.tag, styles.remoteTag]}>
              <Feather name="wifi" size={12} color="#059669" />
              <Text style={styles.remoteText}>Remote</Text>
            </View>
          )}
        </View>
      </View>

      {/* Location and Experience */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Feather name="map-pin" size={14} color="#6B7280" />
          <Text style={styles.infoText}>
            {job.location.city}, {job.location.country}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Feather name="briefcase" size={14} color="#6B7280" />
          <Text style={styles.infoText}>{job.experienceLevel} Level</Text>
        </View>
      </View>

      {/* Salary and Category */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Feather name="dollar-sign" size={14} color="#6B7280" />
          <Text style={styles.infoText}>
            {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Feather name="folder" size={14} color="#6B7280" />
          <Text style={styles.infoText}>{job.category}</Text>
        </View>
      </View>

      {/* Skills */}
      <View style={styles.skillsContainer}>
        {job.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {job.skills.length > 3 && (
          <Text style={styles.moreSkills}>+{job.skills.length - 3} more</Text>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dateInfo}>
          <Text style={styles.postedDate}>
            Posted {formatDate(job.postedDate)}
          </Text>
          {job.applicationDeadline && (
            <Text style={styles.deadline}>
              {getDaysRemaining(job.applicationDeadline)} days left
            </Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => onApply(job)}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  jobTypeTag: {
    backgroundColor: '#EFF6FF',
  },
  jobTypeText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  remoteTag: {
    backgroundColor: '#ECFDF5',
  },
  remoteText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 12,
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#4B5563',
  },
  moreSkills: {
    fontSize: 12,
    color: '#6B7280',
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dateInfo: {
    flex: 1,
  },
  postedDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  deadline: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 2,
  },
  applyButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default JobCard;