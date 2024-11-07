import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';

const ProfileHeader = ({ name, location, phone, avatarUrl, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({ name, location, phone });

  const handleSave = () => {
    onSave(editableData);
    setIsEditing(false);
  };

  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={editableData.name}
            onChangeText={(text) => setEditableData({ ...editableData, name: text })}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={editableData.location}
            onChangeText={(text) => setEditableData({ ...editableData, location: text })}
            placeholder="Location"
          />
          <TextInput
            style={styles.input}
            value={editableData.phone}
            onChangeText={(text) => setEditableData({ ...editableData, phone: text })}
            placeholder="Phone"
          />
          <Button title="Save" onPress={handleSave} />
        </>
      ) : (
        <>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.phone}>{phone}</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: '100%',
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default ProfileHeader;
