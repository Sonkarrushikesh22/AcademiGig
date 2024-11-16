import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

export const BasicInfoForm = ({ data, editing, onChange }) => {
  if (!editing) {
    return (
      <View>
        <View style={styles.infoRow}>
          <Feather name="user" size={20} color="#666" />
          <Text style={styles.infoText}>{data.name || 'Add your name'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={20} color="#666" />
          <Text style={styles.infoText}>{data.location || 'Add location'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="phone" size={20} color="#666" />
          <Text style={styles.infoText}>{data.phone || 'Add phone number'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <TextInput
        style={styles.input}
        value={data.name}
        onChangeText={(text) => onChange({ name: text })}
        placeholder="Full Name"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        value={data.location}
        onChangeText={(text) => onChange({ location: text })}
        placeholder="Location"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        value={data.phone}
        onChangeText={(text) => onChange({ phone: text })}
        placeholder="Phone Number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
      />
    </View>
  );
};

export const AboutForm = ({ data, editing, onChange }) => {
  if (!editing) {
    return (
      <View style={styles.aboutContainer}>
        <Text style={styles.infoText}>
          {data.about || 'Add a brief description about yourself'}
        </Text>
      </View>
    );
  }

  return (
    <TextInput
      style={[styles.input, styles.textArea]}
      value={data.about}
      onChangeText={(text) => onChange({ about: text })}
      placeholder="Write about yourself..."
      placeholderTextColor="#999"
      multiline
      numberOfLines={4}
      textAlignVertical="top"
    />
  );
};

export const SkillsForm = ({ data, editing, onChange }) => {
  const addSkill = () => {
    const newSkills = [...(data.skills || []), ''];
    onChange({ skills: newSkills });
  };

  const updateSkill = (index, value) => {
    const newSkills = [...(data.skills || [])];
    newSkills[index] = value;
    onChange({ skills: newSkills });
  };

  const removeSkill = (index) => {
    const newSkills = [...(data.skills || [])];
    newSkills.splice(index, 1);
    onChange({ skills: newSkills });
  };

  if (!editing) {
    return (
      <View style={styles.skillsContainer}>
        {(data.skills || []).map((skill, index) => (
          <View key={index} style={styles.skillChip}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {(data.skills || []).length === 0 && (
          <Text style={styles.emptyText}>Add your skills</Text>
        )}
      </View>
    );
  }

  return (
    <View>
      {(data.skills || []).map((skill, index) => (
        <Animated.View key={index} style={styles.skillInput}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={skill}
            onChangeText={(text) => updateSkill(index, text)}
            placeholder="Enter skill"
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            onPress={() => removeSkill(index)} 
            style={styles.removeButton}
          >
            <Feather name="x" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </Animated.View>
      ))}
      <TouchableOpacity onPress={addSkill} style={styles.addButton}>
        <Feather name="plus" size={20} color="#007AFF" />
        <Text style={styles.addButtonText}>Add Skill</Text>
      </TouchableOpacity>
    </View>
  );
};

export const ExperienceForm = ({ data, editing, onChange }) => {
  const addExperience = () => {
    const newExperience = [...(data.experience || []), {
      title: '',
      company: '',
      period: '',
      description: '',
    }];
    onChange({ experience: newExperience });
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...(data.experience || [])];
    newExperience[index] = { ...newExperience[index], [field]: value };
    onChange({ experience: newExperience });
  };

  const removeExperience = (index) => {
    const newExperience = [...(data.experience || [])];
    newExperience.splice(index, 1);
    onChange({ experience: newExperience });
  };

  if (!editing) {
    return (
      <View>
        {(data.experience || []).map((exp, index) => (
          <View key={index} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>{exp.title}</Text>
              <Text style={styles.experiencePeriod}>{exp.period}</Text>
            </View>
            <Text style={styles.experienceCompany}>{exp.company}</Text>
            <Text style={styles.experienceDescription}>{exp.description}</Text>
          </View>
        ))}
        {(data.experience || []).length === 0 && (
          <Text style={styles.emptyText}>Add your work experience</Text>
        )}
      </View>
    );
  }

  return (
    <View>
      {(data.experience || []).map((exp, index) => (
        <View key={index} style={styles.experienceForm}>
          <View style={styles.experienceFormHeader}>
            <Text style={styles.experienceFormTitle}>Experience {index + 1}</Text>
            <TouchableOpacity 
              onPress={() => removeExperience(index)}
              style={styles.removeExperienceButton}
            >
              <Feather name="trash-2" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.input}
            value={exp.title}
            onChangeText={(text) => updateExperience(index, 'title', text)}
            placeholder="Job Title"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            value={exp.company}
            onChangeText={(text) => updateExperience(index, 'company', text)}
            placeholder="Company"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            value={exp.period}
            onChangeText={(text) => updateExperience(index, 'period', text)}
            placeholder="Period (e.g., 2020 - Present)"
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={exp.description}
            onChangeText={(text) => updateExperience(index, 'description', text)}
            placeholder="Description"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      ))}
      <TouchableOpacity onPress={addExperience} style={styles.addButton}>
        <Feather name="plus" size={20} color="#007AFF" />
        <Text style={styles.addButtonText}>Add Experience</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  aboutContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#E1E9F5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skillText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  skillInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  removeButton: {
    marginLeft: 8,
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#007AFF',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  experienceItem: {
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  experienceCompany: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  experiencePeriod: {
    fontSize: 14,
    color: '#666',
  },
  experienceDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    lineHeight: 20,
  },
  experienceForm: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  experienceFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceFormTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeExperienceButton: {
    padding: 8,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic',
  },
});