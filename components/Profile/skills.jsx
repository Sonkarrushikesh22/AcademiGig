import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Skills = ({ skills, onEdit }) => {
  return (
    <View style={styles.skillsContainer}>
      <Text style={styles.sectionTitle}>My Skills</Text>
      <View style={styles.skillsList}>
        {skills.map((skill, index) => (
          <Text key={index} style={styles.skillTag}>{skill}</Text>
        ))}
      </View>
      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.editButton}>Edit Skills</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  skillsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillTag: {
    backgroundColor: '#ffedcc',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  editButton: {
    color: '#007bff',
    marginTop: 8,
  },
});

export default Skills;
