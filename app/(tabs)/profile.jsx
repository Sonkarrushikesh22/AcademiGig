import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert,Text,TouchableOpacity } from 'react-native';
import ProfileHeader from '../../components/Profile/Profileheader';
import { CompletionBanner, ProfileSection } from '../../components/Profile/profileSection';
import { BasicInfoForm, AboutForm, SkillsForm, ExperienceForm, ResumeUploadForm } from '../../components/Profile/profileForm';
import { updateProfile, getUserProfile, getPresignedUrl, uploadFileToS3,validateFileSize } from '../../api/userapi';
import CustomDrawer from '../../components/Profile/drawer';
import { Ionicons } from '@expo/vector-icons';

const UserProfileScreen = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const [profile, setProfile] = useState({
    name: '',
    location: '',
    phone: '',
    about: '',
    skills: [],
    experience: [],
    avatarUrl: null,
    resumeUrl: null,
    resumeTemp: null
  });


  const [editingSections, setEditingSections] = useState({
    basic: false,
    about: false,
    skills: false,
    experience: false,
   // resume: false,
  });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        console.log('Raw Profile Data:', profileData);
        
        // Ensure all fields are set
        setProfile({
          name: profileData.name || '',
          location: profileData.location || '',
          phone: profileData.phone || '',
          about: profileData.about || '',
          skills: profileData.skills || [],
          experience: profileData.experience || [],
          avatarUrl: profileData.avatarUrl || null,
          resumeUrl: profileData.resumeUrl || null, // Access from profileData instead of response.data
          resumeTemp: null
        });
      } catch (error) {
        console.error('Profile Fetch Error:', error);
      }
    };

    fetchProfile();
  }, []);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = ['name', 'location', 'phone', 'about', 'avatarUrl','resumeUrl'];
    const completed = fields.filter(field => profile[field] && profile[field].length > 0).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Handle profile update
  const handleUpdateProfile = async (section, data) => {
    try {
      const updatedProfile = { ...profile, ...data };
      await updateProfile(updatedProfile);
      setProfile(updatedProfile);
      setEditingSections(prev => ({ ...prev, [section]: false }));
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };


// Handle image upload for avatar
const handleAvatarUpload = async (imageUri) => {
  try {
    // Validate file size (5MB limit)
    const isValidSize = await validateFileSize(imageUri, 5);
    if (!isValidSize) {
      Alert.alert('Error', 'Image size must be less than 5MB');
      return;
    }

    // Create file object
    const timestamp = Date.now();
    const file = {
      uri: imageUri,
      name: `avatar-${timestamp}.jpg`,
      type: 'image/jpeg'
    };

    // Get presigned URL
    const presignedUrl = await getPresignedUrl('avatar', file.name, file.type);
    if (!presignedUrl) {
      throw new Error('Failed to get upload URL');
    }
    
    // Upload to S3
    const uploadResult = await uploadFileToS3(presignedUrl, file, file.type);
    
    // Update profile with both URL and key
    const updatedProfile = {
      ...profile,
      avatarUrl: uploadResult.url,
      avatarKey: uploadResult.key  // Add the key to the update
    };

    // Send update to backend
    const response = await updateProfile(updatedProfile);
    
    // Update local state
    setProfile(prev => ({
      ...prev,
      avatarUrl: uploadResult.url,
      avatarKey: uploadResult.key
    }));
    
    console.log('Profile updated with new avatar:', {
      url: uploadResult.url,
      key: uploadResult.key
    });
    
    Alert.alert('Success', 'Profile picture updated successfully');
  } catch (error) {
    console.error('Error uploading avatar:', error);
    Alert.alert('Error', 'Failed to upload profile picture');
  }
};

// Handle resume upload
const handleResumeUpload = async (resumeUri) => {
  if (!resumeUri) {
    console.error('No resume URI provided');
    Alert.alert('Error', 'No resume file selected');
    return;
  }

  try {
    console.log('Starting resume upload with URI:', resumeUri);
    
    // Validate file size (10MB limit for PDFs)
    const isValidSize = await validateFileSize(resumeUri, 10);
    if (!isValidSize) {
      Alert.alert('Error', 'Resume size must be less than 10MB');
      return;
    }

    const timestamp = Date.now();
    const file = {
      uri: resumeUri,
      name: `resume-${timestamp}.pdf`,
      type: 'application/pdf'
    };

    // Get presigned URL
    const presignedUrl = await getPresignedUrl('resume', file.name, file.type);
    if (!presignedUrl) {
      throw new Error('Failed to get upload URL');
    }

    // Upload to S3
    const uploadResult = await uploadFileToS3(presignedUrl, file, file.type);
    
    // Update profile with new resume URL
    const updatedProfile = {
      ...profile,
      resumeKey: uploadResult.key,
      resumeUrl: uploadResult.url,  // Ensure this is the permanent URL
      resumeTemp: null // Clear temporary data after successful upload
    };
    
    await updateProfile(updatedProfile);
    setProfile(updatedProfile);
    
    Alert.alert('Success', 'Resume uploaded successfully');
  } catch (error) {
    console.error('Error uploading resume:', error);
    Alert.alert('Error', 'Failed to upload resume');
  }
};
return (
  <View style={styles.mainContainer}>
    {/* Sticky Header */}
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Profile</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsDrawerOpen(true)}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>

    {/* Scrollable Content */}
    <ScrollView style={styles.scrollContainer}>
      <CompletionBanner percentage={calculateProfileCompletion()} />
      
      <ProfileHeader
        avatarUrl={profile.avatarUrl}
        avatarKey={profile.avatarKey}
        onImageUpdate={handleAvatarUpload}
      />

      <ProfileSection
        title="Basic Information"
        editing={editingSections.basic}
        onEdit={() => setEditingSections(prev => ({ ...prev, basic: true }))}
        onSave={() => handleUpdateProfile('basic', {
          name: profile.name,
          location: profile.location,
          phone: profile.phone,
        })}
      >
        <BasicInfoForm
          data={profile}
          editing={editingSections.basic}
          onChange={data => setProfile(prev => ({ ...prev, ...data }))}
        />
      </ProfileSection>

      <ProfileSection
        title="About"
        editing={editingSections.about}
        onEdit={() => setEditingSections(prev => ({ ...prev, about: true }))}
        onSave={() => handleUpdateProfile('about', { about: profile.about })}
      >
        <AboutForm
          data={profile}
          editing={editingSections.about}
          onChange={data => setProfile(prev => ({ ...prev, ...data }))}
        />
      </ProfileSection>

      <ProfileSection
        title="Skills"
        editing={editingSections.skills}
        onEdit={() => setEditingSections(prev => ({ ...prev, skills: true }))}
        onSave={() => handleUpdateProfile('skills', { skills: profile.skills })}
      >
        <SkillsForm
          data={profile}
          editing={editingSections.skills}
          onChange={data => setProfile(prev => ({ ...prev, ...data }))}
        />
      </ProfileSection>

      <ProfileSection
        title="Experience"
        editing={editingSections.experience}
        onEdit={() => setEditingSections(prev => ({ ...prev, experience: true }))}
        onSave={() => handleUpdateProfile('experience', { experience: profile.experience })}
      >
        <ExperienceForm
          data={profile}
          editing={editingSections.experience}
          onChange={data => setProfile(prev => ({ ...prev, ...data }))}
        />
      </ProfileSection>

      <ProfileSection
        title="Resume"
        editing={editingSections.resume}
        onEdit={() => setEditingSections((prev) => ({ ...prev, resume: true }))}
        onSave={() => {
          if (profile.resumeTemp && profile.resumeTemp.uri) {
            handleResumeUpload(profile.resumeTemp.uri);
          }
          setEditingSections((prev) => ({ ...prev, resume: false }));
        }}
      >
        <ResumeUploadForm
          data={{
            resumeUrl: profile.resumeUrl,
            resumeTemp: profile.resumeTemp
          }}
          editing={editingSections.resume}
          onChange={(fileData) => {
            console.log('Resume file data:', fileData);
            setProfile((prev) => ({
              ...prev,
              resumeTemp: fileData,
              resumeUrl: fileData ? fileData.uri : null
            }));
          }}
        />
      </ProfileSection>
    </ScrollView>
    <CustomDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
  </View>
);
};

const styles = StyleSheet.create({
mainContainer: {
  flex: 1,
},
headerContainer: {
  marginTop: 20,
  padding: 16,
},
scrollContainer: {
  flex: 1,
},
headerContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // Changed to space-between
},
headerTextContainer: {
  flex: 1,
  alignItems: 'center',
},
headerText: {
  fontSize: 20,
  fontWeight: '600',
},
menuButton: {
  padding: 4,
},

});

export default UserProfileScreen;
