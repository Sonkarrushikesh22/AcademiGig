import React, { useState,  useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
import { getDownloadPresignedUrl } from '../../api/userapi';

const ProfilePlaceholder = () => (
  <View style={styles.placeholderContainer}>
    <View style={styles.placeholderHead} />
    <View style={styles.placeholderBody} />
  </View>
);

const ProfileHeader = ({ avatarUrl, avatarKey, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [displayUrl, setDisplayUrl] = useState(null);
  // Function to get the display URL
  const getDisplayUrl = async () => {
    // If avatarKey exists, generate a new presigned download URL
    if (avatarKey) {
      try {
        const presignedUrl = await getDownloadPresignedUrl(avatarKey, 'avatar');
        return presignedUrl;
      } catch (error) {
        console.error('Failed to get download URL:', error);
        return null;
      }
    }
    
    // Fallback to existing avatarUrl if available
    return avatarUrl || null;
  };

  useEffect(() => {
    const loadDisplayUrl = async () => {
      const url = await getDisplayUrl();
      setDisplayUrl(url);
    };

    loadDisplayUrl();
  }, [avatarUrl, avatarKey]);

  const handleImagePick = async () => {
    if (uploading) return;

    try {
      // Request permissions first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }

      setUploading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        // Check file size
        const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
        const fileSize = fileInfo.size / (1024 * 1024); // Convert to MB

        if (fileSize > 5) {
          alert('Please select an image under 5MB');
          return;
        }

        await onImageUpdate(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image pick error:', error);
      alert('Failed to select image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={handleImagePick} 
        disabled={uploading}
        style={styles.avatarButton}
      >
        {displayUrl ? (
          <Image 
            source={{ uri: displayUrl }} 
            style={styles.avatar}
            // Add cache control
            loadingIndicatorSource={require('../../assets/profilePlaceHolder.png')} // Add a placeholder image
            onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <ProfilePlaceholder />
          </View>
        )}
        <View style={[styles.editIconContainer, uploading && styles.uploadingContainer]}>
          <Feather 
            name={uploading ? "loader" : "camera"} 
            size={16} 
            color="#FFF"
            style={uploading ? styles.spinningIcon : null}
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.tapToChangeText}>
        {uploading ? 'Uploading...' : 'Tap to change profile photo'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  avatarButton: {
    marginBottom: 8,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#E1E9F5', // Add placeholder background color
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E1E9F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B0C4DE',
    marginBottom: -5,
  },
  placeholderBody: {
    width: 60,
    height: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#B0C4DE',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  uploadingContainer: {
    backgroundColor: '#666',
  },
  spinningIcon: {
    transform: [{ rotate: '45deg' }],
  },
  tapToChangeText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  // Add animation styles for the loading state
  '@keyframes spin': {
    from: { transform: [{ rotate: '0deg' }] },
    to: { transform: [{ rotate: '360deg' }] },
  },
});

export default ProfileHeader;