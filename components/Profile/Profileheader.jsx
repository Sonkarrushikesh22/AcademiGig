import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ProfileHeader = ({ name, location, phone, avatarUrl, onEdit }) => {
  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.location}>{location}</Text>
      <Text style={styles.phone}>{phone}</Text>
      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.editButton}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: 'gray',
  },
  phone: {
    fontSize: 14,
    color: 'gray',
  },
  editButton: {
    color: '#007bff',
    marginTop: 8,
  },
});

export default ProfileHeader;
