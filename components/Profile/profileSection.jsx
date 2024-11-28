import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

// ProfileSection Component
const ProfileSection = ({
  title,
  children,
  editing = false,
  onEdit,
  onSave,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {editing ? (
          <TouchableOpacity onPress={onSave} style={styles.saveButton}>
            <Feather name="check" size={16} color="white" style={styles.buttonIcon} />
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Feather name="edit-2" size={16} color="#4B5563" style={styles.buttonIcon} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionContent}>{children}</View>
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
          <Text style={styles.bannerTitle}>Profile Completion</Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${percentage}%`, backgroundColor: getStatusColor(percentage) },
            ]}
          />
        </View>

        <Text style={styles.messageText}>{getMessage(percentage)}</Text>

        {percentage < 100 && (
          <TouchableOpacity style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Complete your profile</Text>
            <Feather name="chevron-right" size={16} color="#1D4ED8" />
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
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#EBF5FF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343a40',
  },
  sectionContent: {
    padding: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D4ED8',
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
    color: '#374151',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  // Banner Styles
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  bannerContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
  },
  messageText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#E0F2FE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D4ED8',
    marginRight: 4,
  },
});

export { ProfileSection, CompletionBanner };
