import React, { useState } from 'react';
import { ScrollView, StyleSheet, Button } from 'react-native';
import ProfileHeader from './components/ProfileHeader';
import Skills from './components/Skills';
import Experience from './components/Experience';

const UserProfileScreen = () => {
  const [userData, setUserData] = useState({
    name: 'Sergio Aguero',
    location: 'Jakarta, Indonesian',
    phone: '+62 818-3136-2121',
    avatarUrl: 'https://example.com/avatar.jpg',
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
