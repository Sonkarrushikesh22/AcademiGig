import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import LogoPlaceholder from './logoPlaceholder';

const { width } = Dimensions.get('window');

const SmallCard = ({ job, onSave, getLogoUrl, onPress, isSaved }) => {
  const [logo, setLogo] = useState({ type: 'placeholder' });

  useEffect(() => {
    const loadLogo = async () => {
      if (job.logoKey) {
        const result = await getLogoUrl(job.logoKey);
        setLogo(result);
      }
    };
    
    loadLogo();
  }, [job.logoKey, getLogoUrl]);

  const renderLogo = () => {
    if (logo.type === 'file') {
      return (
        <Image
          source={{ uri: `file://${logo.path}` }}
          style={styles.logoSmall}
          resizeMode="cover"
        />
      );
    }
    return <LogoPlaceholder size={50} />;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={() => onSave(job)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather 
          name={isSaved ? "bookmark" : "bookmark"} 
          size={20} 
          color={isSaved ? "#007BFF" : "#6B7280"} 
        />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        {renderLogo()}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.companyName}>{job.company}</Text>
        <Text style={styles.jobType}>{job.jobType}</Text>
        <Text style={styles.salary}>
          {job.salary?.currency ? `${job.salary.currency} salary` : 'Not specified'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 5,
  },
  logoContainer: {
    marginRight: 15,
  },
  logoSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
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