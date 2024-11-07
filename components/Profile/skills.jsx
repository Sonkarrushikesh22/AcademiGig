import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';

const Skills = ({ skills, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableSkills, setEditableSkills] = useState(skills);

  const handleAddSkill = () => {
    setEditableSkills([...editableSkills, '']);
  };

  const handleSave = () => {
    onSave(editableSkills);
    setIsEditing(false);
  };

  return (
    <View style={styles.skillsContainer}>
      <Text style={styles.sectionTitle}>My Skills</Text>
      {isEditing ? (
        <>
          {editableSkills.map((skill, index) => (
            <TextInput
              key={index}
              style={styles.input}
              value={skill}
              onChangeText={(text) =>
                setEditableSkills(editableSkills.map((s, i) => (i === index ? text : s)))
              }
              placeholder="Skill"
            />
          ))}
          <Button title="Add Skill" onPress={handleAddSkill} />
          <Button title="Save" onPress={handleSave} />
        </>
      ) : (
        <>
          <View style={styles.skillsList}>
            {skills.map((skill, index) => (
              <Text key={index} style={styles.skillTag}>{skill}</Text>
            ))}
          </View>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editButton}>Edit Skills</Text>
          </TouchableOpacity>
        </>
      )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: '100%',
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default Skills;
