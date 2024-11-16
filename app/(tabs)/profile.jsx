import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import ProfileHeader from '../../components/Profile/Profileheader';
import {CompletionBanner,  ProfileSection} from '../../components/Profile/profileSection';
import { BasicInfoForm, AboutForm, SkillsForm, ExperienceForm } from '../../components/Profile/profileForm';

const UserProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: '',
    location: '',
    phone: '',
    about: '',
    skills: [],
    experience: [],
    avatarUrl: null,
  });

  const [editingSections, setEditingSections] = useState({
    basic: false,
    about: false,
    skills: false,
    experience: false,
  });

  const handleUpdateProfile = (section, data) => {
    setProfile(prev => ({ ...prev, ...data }));
    setEditingSections(prev => ({ ...prev, [section]: false }));
  };

  const calculateProfileCompletion = () => {
    const fields = ['name', 'location', 'phone', 'about', 'avatarUrl'];
    const completed = fields.filter(field => profile[field] && profile[field].length > 0).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <ScrollView style={styles.container}>
      <CompletionBanner percentage={calculateProfileCompletion()} />
      
      <ProfileHeader 
        avatarUrl={profile.avatarUrl}
        onImageUpdate={url => setProfile(prev => ({ ...prev, avatarUrl: url }))}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default UserProfileScreen;