import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Modal, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import LogoPlaceholder from './logoPlaceholder';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const LargeCard = ({ job, onSave, onApply, getLogoUrl, onClose, visible, isSaved }) => {
  const [logo, setLogo] = useState({ type: 'placeholder' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          style={styles.logoLarge}
          resizeMode="cover"
        />
      );
    }
    return <LogoPlaceholder size={100} />;
  };

  const handleApply = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onApply(job);
    } catch (error) {
      Alert.alert(
        'Application Failed',
        error.message || 'Failed to submit application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderApplyButton = () => {
    if (job.hasApplied) {
      return (
        <TouchableOpacity style={[styles.applyButton, styles.appliedButton]} disabled>
          <Text style={styles.applyButtonText}>Already Applied</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={[styles.applyButton, isSubmitting && styles.submittingButton]} 
        onPress={handleApply}
        disabled={isSubmitting}
      >
        <Text style={styles.applyButtonText}>
          {isSubmitting ? 'Submitting...' : 'Apply Now'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={50} style={styles.container} tint="dark">
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={() => onSave(job)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather 
              name={isSaved ? "bookmark" : "bookmark"} 
              size={24} 
              color={isSaved ? "#007BFF" : "#6B7280"} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={24} color="#6B7280" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.logoContainer}>
              {renderLogo()}
            </View>

            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.companyName}>{job.company}</Text>
            <Text style={styles.jobType}>{job.jobType}</Text>
            <Text style={styles.salary}>
              {job.salary?.currency ? `${job.salary.currency} salary` : 'Not specified'}
            </Text>

            <Text style={styles.sectionHeader}>Description</Text>
            <Text style={styles.description}>{job.description}</Text>

            <Text style={styles.sectionHeader}>Requirements</Text>
            {job.requirements?.map((req, index) => (
              <Text key={index} style={styles.listItem}>{`• ${req}`}</Text>
            ))}

            <Text style={styles.sectionHeader}>Responsibilities</Text>
            {job.responsibilities?.map((resp, index) => (
              <Text key={index} style={styles.listItem}>{`• ${resp}`}</Text>
            ))}
          </ScrollView>
          {renderApplyButton()}
         
        </View>
       
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    padding: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    padding: 5,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoLarge: {
    width: 100,
    height: 100,
    borderRadius: 15,
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
    paddingLeft: 10,
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
  submittingButton: {
    backgroundColor: '#4A90E2',
    opacity: 0.7,
  },
  appliedButton: {
    backgroundColor: '#6B7280',
  },
});

export default LargeCard;