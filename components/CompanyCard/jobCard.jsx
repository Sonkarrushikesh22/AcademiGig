import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SmallCard = ({ job, onSave, getLogoUrl }) => {
  return (
    <View style={styles.card}>
      {/* Save Icon */}
      <TouchableOpacity style={styles.saveButton} onPress={() => onSave(job)}>
        <Feather name="bookmark" size={20} color="#007BFF" />
      </TouchableOpacity>

      {/* Job Logo */}
      <Image
        source={{
          uri: job.logoKey
            ? getLogoUrl(job.logoKey)
            : 'https://via.placeholder.com/50',
        }}
        style={styles.logoSmall}
      />

      {/* Job Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.companyName}>{job.company}</Text>
        <Text style={styles.jobType}>{job.jobType}</Text>
        <Text style={styles.salary}>
          {job.salary?.currency ? `${job.salary.currency} salary` : 'Not specified'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: width * 0.05,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  logoSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15, // Adds spacing between logo and info
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#000',
  },
  companyName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  jobType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  salary: {
    fontSize: 14,
    color: '#007BFF',
  },
});

export default SmallCard;
