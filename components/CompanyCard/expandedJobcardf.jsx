import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LargeCard = ({ job, onSave, onApply, getLogoUrl, onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Save Icon */}
        <TouchableOpacity style={styles.saveButton} onPress={() => onSave(job)}>
          <Feather name="bookmark" size={24} color="#007BFF" />
        </TouchableOpacity>

        {/* Close Icon */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={24} color="#6B7280" />
        </TouchableOpacity>

        <ScrollView>
          {/* Job Logo */}
          <Image
            source={{
              uri: job.logoKey
                ? getLogoUrl(job.logoKey)
                : 'https://via.placeholder.com/100',
            }}
            style={styles.logoLarge}
          />

          {/* Job Details */}
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>
          <Text style={styles.jobType}>{job.jobType}</Text>
          <Text style={styles.salary}>
            {job.salary?.currency ? `${job.salary.currency} salary` : 'Not specified'}
          </Text>

          {/* Description */}
          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.description}>{job.description}</Text>

          {/* Requirements */}
          <Text style={styles.sectionHeader}>Requirements</Text>
          {job.requirements.map((req, index) => (
            <Text key={index} style={styles.listItem}>{`• ${req}`}</Text>
          ))}

          {/* Responsibilities */}
          <Text style={styles.sectionHeader}>Responsibilities</Text>
          {job.responsibilities.map((resp, index) => (
            <Text key={index} style={styles.listItem}>{`• ${resp}`}</Text>
          ))}
        </ScrollView>

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyButton} onPress={() => onApply(job)}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  saveButton: {
    position: 'absolute',
    top: 15,
    right: 50,
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  logoLarge: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  companyName: {
    fontSize: 16,
    marginBottom: 10,
    color: '#6B7280',
  },
  jobType: {
    fontSize: 16,
    marginBottom: 10,
    color: '#6B7280',
  },
  salary: {
    fontSize: 16,
    marginBottom: 20,
    color: '#007BFF',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  applyButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LargeCard;
