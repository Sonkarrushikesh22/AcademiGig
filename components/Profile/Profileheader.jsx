import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

const ProfilePlaceholder = () => (
  <View style={styles.placeholderContainer}>
    <View style={styles.placeholderHead} />
    <View style={styles.placeholderBody} />
    <View style={styles.placeholderInitials}>
      <Text style={styles.initialsText}>Profile</Text>
    </View>
  </View>
);

const ProfileHeader = ({ avatarUrl, onImageUpdate }) => {
  const [uploading, setUploading] = useState(false);

  const handleImagePick = async () => {
    if (uploading) return;

    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        onImageUpdate(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image pick error:', error);
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
        {avatarUrl ? (
          <Image 
            source={{ uri: avatarUrl }} 
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <ProfilePlaceholder />
          </View>
        )}
        <View style={styles.editIconContainer}>
          <Feather 
            name={uploading ? "loader" : "camera"} 
            size={16} 
            color="#FFF"
            style={uploading ? styles.spinningIcon : null}
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.tapToChangeText}>Tap to change profile photo</Text>
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
  placeholderInitials: {
    position: 'absolute',
    top: '60%',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 14,
    color: '#6B8CC7',
    fontWeight: '600',
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
  spinningIcon: {
    transform: [{ rotate: '45deg' }],
  },
  tapToChangeText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});

export default ProfileHeader;