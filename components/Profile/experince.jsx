import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Experience = ({ experience, onEdit }) => {
  return (
    <View style={styles.experienceContainer}>
      <Text style={styles.sectionTitle}>My Experience</Text>
      {experience.map((job, index) => (
        <View key={index} style={styles.jobItem}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobDetails}>{job.company} ({job.startYear} - {job.endYear})</Text>
        </View>
      ))}
      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.editButton}>Edit Experience</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  experienceContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  jobItem: {
    marginTop: 8,
  },
  jobTitle: {
    fontWeight: 'bold',
  },
  jobDetails: {
    color: 'gray',
  },
  editButton: {
    color: '#007bff',
    marginTop: 8,
  },
});

export default Experience;
