import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native';

const Experience = ({ experience, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableExperience, setEditableExperience] = useState(experience);

  const handleSave = () => {
    onSave(editableExperience);
    setIsEditing(false);
  };

  return (
    <View style={styles.experienceContainer}>
      <Text style={styles.sectionTitle}>My Experience</Text>
      {isEditing ? (
        <>
          {editableExperience.map((job, index) => (
            <View key={index} style={styles.jobItem}>
              <TextInput
                style={styles.input}
                value={job.title}
                onChangeText={(text) =>
                  setEditableExperience(editableExperience.map((j, i) =>
                    i === index ? { ...j, title: text } : j
                  ))
                }
                placeholder="Job Title"
              />
              <TextInput
                style={styles.input}
                value={job.company}
                onChangeText={(text) =>
                  setEditableExperience(editableExperience.map((j, i) =>
                    i === index ? { ...j, company: text } : j
                  ))
                }
                placeholder="Company"
              />
              <TextInput
                style={styles.input}
                value={job.startYear}
                onChangeText={(text) =>
                  setEditableExperience(editableExperience.map((j, i) =>
                    i === index ? { ...j, startYear: text } : j
                  ))
                }
                placeholder="Start Year"
              />
              <TextInput
                style={styles.input}
                value={job.endYear}
                onChangeText={(text) =>
                  setEditableExperience(editableExperience.map((j, i) =>
                    i === index ? { ...j, endYear: text } : j
                  ))
                }
                placeholder="End Year"
              />
            </View>
          ))}
          <Button title="Save" onPress={handleSave} />
        </>
      ) : (
        <>
          {experience.map((job, index) => (
            <View key={index} style={styles.jobItem}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobDetails}>{job.company} ({job.startYear} - {job.endYear})</Text>
            </View>
          ))}
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editButton}>Edit Experience</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  experienceContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  jobItem: {
    marginTop: 8,
  },
  jobTitle: {
    fontWeight: 'bold',
  },
  jobDetails: {
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

export default Experience;
