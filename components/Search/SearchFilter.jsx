import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,

} from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';

const FilterForm = ({ onApplyFilters, onClose }) => {
  const [filters, setFilters] = useState({
    jobType: 'all',
    experienceLevel: 'all',
    salary: {
      min: 0,
      max: 200000,
    },
    location: 'all',
    industry: 'all',
  });

  const jobTypes = ['all', 'full-time', 'part-time', 'contract', 'internship'];
  const experienceLevels = ['all', 'entry', 'intermediate', 'senior', 'lead'];
  const locations = ['all', 'remote', 'on-site', 'hybrid'];
  const industries = ['all', 'technology', 'healthcare', 'finance', 'education', 'retail'];

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const resetFilters = () => {
    setFilters({
      jobType: 'all',
      experienceLevel: 'all',
      salary: {
        min: 0,
        max: 200000,
      },
      location: 'all',
      industry: 'all',
    });
  };

  const renderSelector = (title, options, currentValue, field) => (
    <View style={styles.filterSection}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              filters[field] === option && styles.optionButtonSelected,
            ]}
            onPress={() => setFilters({ ...filters, [field]: option })}
          >
            <Text
              style={[
                styles.optionText,
                filters[field] === option && styles.optionTextSelected,
              ]}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter Jobs</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer}>
        {renderSelector('Job Type', jobTypes, filters.jobType, 'jobType')}
        {renderSelector(
          'Experience Level',
          experienceLevels,
          filters.experienceLevel,
          'experienceLevel'
        )}

        <View style={styles.filterSection}>
          <Text style={styles.label}>Salary Range</Text>
          <View style={styles.salaryContainer}>
            <Text style={styles.salaryText}>
              ${Math.round(filters.salary.min).toLocaleString()}
            </Text>
            <Text style={styles.salaryText}>
              ${Math.round(filters.salary.max).toLocaleString()}
            </Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={200000}
              step={5000}
              value={filters.salary.max}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#ddd"
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  salary: { ...filters.salary, max: value },
                })
              }
            />
          </View>
        </View>

        {renderSelector('Location', locations, filters.location, 'location')}
        {renderSelector('Industry', industries, filters.industry, 'industry')}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={resetFilters}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.applyButton]}
          onPress={handleApplyFilters}
        >
          <Text style={[styles.buttonText, styles.applyButtonText]}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    marginVertical: 4,
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
  },
  salaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  salaryText: {
    fontSize: 14,
    color: '#333',
  },
  sliderContainer: {
    paddingHorizontal: 6,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f5f5f5',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButtonText: {
    color: '#fff',
  },
});

export default FilterForm;