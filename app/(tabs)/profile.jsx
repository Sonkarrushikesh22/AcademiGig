import React, { useState } from 'react';
import { ScrollView, StyleSheet, Button } from 'react-native';
import ProfileHeader from '../../components/Profile/Profileheader';
import Skills from '../../components/Profile/skills';
import Experience from '../../components/Profile/experince';

const UserProfileScreen = () => {
  const [userData, setUserData] = useState({
    name: 'Manu Yeduu',
    location: 'Jakarta, Indonesian',
    phone: '+62 818-3136-2121',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'hello, I’m a UI/UX Designer with 2 years of experience...',
    skills: ['UI Design', 'UX Design', 'Wireframing', 'Motion Graphic', 'Figma', 'After Effects', 'Adobe XD'],
    experience: [
      { title: 'Telkom High Junior School', company: 'School', startYear: '2017', endYear: '2021' },
      { title: 'Freelancer', company: 'work', startYear: '2021', endYear: 'present' },
    ],
  });

  const handleEditProfile = () => {
    // Open profile edit modal or navigate to edit screen
  };

  const handleEditSkills = () => {
    // Open skills edit modal or navigate to edit screen
  };

  const handleEditExperience = () => {
    // Open experience edit modal or navigate to edit screen
  };

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader
        name={userData.name}
        location={userData.location}
        phone={userData.phone}
        avatarUrl={userData.avatarUrl}
        onEdit={handleEditProfile}
      />
      <Skills skills={userData.skills} onEdit={handleEditSkills} />
      <Experience experience={userData.experience} onEdit={handleEditExperience} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default UserProfileScreen;
