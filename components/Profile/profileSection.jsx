import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

// ProfileSection Component
const ProfileSection = ({ 
  title, 
  children, 
  editing = false, 
  onEdit, 
  onSave 
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>
        {editing ? (
          <TouchableOpacity 
            onPress={onSave}
            style={styles.saveButton}
          >
            <Feather name="check" size={16} color="white" style={styles.buttonIcon} />
            <Text style={styles.saveButtonText}>
              Save
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            onPress={onEdit}
            style={styles.editButton}
          >
            <Feather name="edit-2" size={16} color="#666" style={styles.buttonIcon} />
            <Text style={styles.editButtonText}>
              Edit
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

// CompletionBanner Component
const CompletionBanner = ({ percentage }) => {
  const getStatusColor = (percent) => {
    if (percent < 30) return '#EF4444'; // red-500
    if (percent < 70) return '#F59E0B'; // yellow-500
    return '#10B981'; // green-500
  };

  const getMessage = (percent) => {
    if (percent < 30) return 'Your profile needs more information';
    if (percent < 70) return 'Getting there! Add more details to stand out';
    if (percent < 100) return 'Almost complete! Just a few more touches';
    return 'Great job! Your profile is complete';
  };

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerContent}>
        <View style={styles.bannerHeader}>
          <Text style={styles.bannerTitle}>
            Profile Completion
          </Text>
          <Text style={styles.percentageText}>
            {percentage}%
          </Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar,
              { width: `${percentage}%`, backgroundColor: getStatusColor(percentage) }
            ]}
          />
        </View>
        
        <Text style={styles.messageText}>
          {getMessage(percentage)}
        </Text>
        
        {percentage < 100 && (
          <TouchableOpacity 
            style={styles.completeButton}
          >
            <Text style={styles.completeButtonText}>
              Complete your profile
            </Text>
            <Feather name="chevron-right" size={16} color="#3B82F6" />
          </TouchableOpacity>
        )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Section Styles
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionContent: {
    padding: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonIcon: {
    marginRight: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },

  // Banner Styles
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  bannerContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  messageText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginRight: 4,
  },
});

export { ProfileSection, CompletionBanner };