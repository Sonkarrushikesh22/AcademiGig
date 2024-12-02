import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getFilterOptions, getJobsByCategory } from '../../api/jobsapi';
import { useRouter, useLocalSearchParams } from "expo-router";

const SearchFilter = ({ initialFilters = {}, onApplyFilters, onClose }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const defaultFilterOptions = {
    categories: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing',
      'Sales', 'Engineering', 'Design', 'Customer Service', 'Human Resources',
      'Administrative', 'Legal', 'Manufacturing', 'Construction', 'Retail'
    ],
    jobTypes: [
      'Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'
    ],
    experienceLevels: ['Entry', 'Mid', 'Senior']
  };


  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);
  const [filters, setFilters] = useState({
    category: 'all',
    jobType: 'all',
    experienceLevel: 'all',
    minSalary: 0,
    maxSalary: 200000,
    currency: 'USD',
    city: '',
    state: '',
    country: '',
    isRemote: false,
    skills: [],
    page: 1,
    limit: 10,
    sortBy: 'postedDate',
    sortOrder: 'desc',
    ...initialFilters
  });

  const fetchFilterOptions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const options = await getFilterOptions();
      if (options) {
        setFilterOptions({
          categories: options.categories || defaultFilterOptions.categories,
          jobTypes: options.jobTypes || defaultFilterOptions.jobTypes,
          experienceLevels: options.experienceLevels || defaultFilterOptions.experienceLevels
        });
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      setError(error.message || 'Failed to fetch filter options');
      
      // Fallback to default options in case of API error
      setFilterOptions(defaultFilterOptions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const handleApplyFilters = async () => {
    try {
      // Create clean filters object removing empty/default values
      const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (
          value !== 'all' && 
          value !== '' && 
          value !== undefined && 
          value !== null &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          acc[key] = value;
        }
        return acc;
      }, {});
  
      // Ensure these parameters are always included
      cleanFilters.page = 1;
      cleanFilters.limit = 10;
      
      // Add search parameter if exists
      if (params.search) {
        cleanFilters.search = params.search;
      }
  
      console.log('Applying filters:', cleanFilters);
  
      if (onApplyFilters) {
        onApplyFilters(cleanFilters);
      }
  
      onClose();
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };
  
  const resetFilters = () => {
    setFilters({
      category: 'all',
      jobType: 'all',
      experienceLevel: 'all',
      minSalary: 0,
      maxSalary: 200000,
      currency: 'USD',
      city: '',
      state: '',
      country: '',
      isRemote: false,
      skills: [],
      page: 1,
      limit: 10,
      sortBy: 'postedDate',
      sortOrder: 'desc'
    });
  };

  const handleAddSkill = (skill) => {
    if (skill.trim() && !filters.skills.includes(skill.trim())) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const renderSelector = (title, options, value, field) => (
    <View style={styles.filterSection}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          key="all"
          style={[
            styles.optionButton,
            value === 'all' && styles.optionButtonSelected,
          ]}
          onPress={() => setFilters({ ...filters, [field]: 'all' })}
        >
          <Text
            style={[
              styles.optionText,
              value === 'all' && styles.optionTextSelected,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {options?.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              value === option && styles.optionButtonSelected,
            ]}
            onPress={() => setFilters({ ...filters, [field]: option })}
          >
            <Text
              style={[
                styles.optionText,
                value === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading filter options...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={fetchFilterOptions} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filter Jobs</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        {renderSelector('Category', filterOptions.categories, filters.category, 'category')}
        {renderSelector('Job Type', filterOptions.jobTypes, filters.jobType, 'jobType')}
        {renderSelector('Experience Level', filterOptions.experienceLevels, filters.experienceLevel, 'experienceLevel')}

        {/* Rest of the component remains the same as in the previous implementation */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Skills</Text>
          <View style={styles.skillsInputContainer}>
            <TextInput
              style={styles.skillInput}
              placeholder="Add a skill"
              onSubmitEditing={(e) => {
                handleAddSkill(e.nativeEvent.text);
                e.target.clear();
              }}
            />
          </View>
          <View style={styles.skillsContainer}>
            {filters.skills.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={styles.skillChip}
                onPress={() => handleRemoveSkill(skill)}
              >
                <Text style={styles.skillChipText}>{skill}</Text>
                <MaterialIcons name="close" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Salary Range, Location, Sort By sections remain the same */}
        <View style={styles.filterSection}>
          <Text style={styles.label}>Salary Range</Text>
          <View style={styles.salaryInputContainer}>
            <View style={styles.salaryInputWrapper}>
              <Text style={styles.salaryInputLabel}>Min</Text>
              <TextInput
                style={styles.salaryInput}
                value={filters.minSalary.toString()}
                onChangeText={(value) => 
                  setFilters({
                    ...filters,
                    minSalary: parseInt(value) || 0
                  })
                }
                keyboardType="numeric"
                placeholder="Min salary"
              />
            </View>
            <View style={styles.salaryInputWrapper}>
              <Text style={styles.salaryInputLabel}>Max</Text>
              <TextInput
                style={styles.salaryInput}
                value={filters.maxSalary.toString()}
                onChangeText={(value) =>
                  setFilters({
                    ...filters,
                    maxSalary: parseInt(value) || 0
                  })
                }
                keyboardType="numeric"
                placeholder="Max salary"
              />
            </View>
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.locationInput}
            value={filters.city}
            onChangeText={(text) => setFilters({ ...filters, city: text })}
            placeholder="City"
          />
          <TextInput
            style={styles.locationInput}
            value={filters.state}
            onChangeText={(text) => setFilters({ ...filters, state: text })}
            placeholder="State"
          />
          <TextInput
            style={styles.locationInput}
            value={filters.country}
            onChangeText={(text) => setFilters({ ...filters, country: text })}
            placeholder="Country"
          />
          <TouchableOpacity
            style={[
              styles.remoteButton,
              filters.isRemote && styles.remoteButtonSelected,
            ]}
            onPress={() => setFilters({ ...filters, isRemote: !filters.isRemote })}
          >
            <Text
              style={[
                styles.remoteButtonText,
                filters.isRemote && styles.optionTextSelected,
              ]}
            >
              Remote Only
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.label}>Sort By</Text>
          <View style={styles.sortContainer}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                filters.sortBy === 'postedDate' && styles.sortButtonSelected,
              ]}
              onPress={() => setFilters({ ...filters, sortBy: 'postedDate' })}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  filters.sortBy === 'postedDate' && styles.optionTextSelected,
                ]}
              >
                Date Posted
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                filters.sortBy === 'salary' && styles.sortButtonSelected,
              ]}
              onPress={() => setFilters({ ...filters, sortBy: 'salary' })}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  filters.sortBy === 'salary' && styles.optionTextSelected,
                ]}
              >
                Salary
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.sortContainer, { marginTop: 8 }]}>
            <TouchableOpacity
              style={[
                styles.sortButton,
                filters.sortOrder === 'asc' && styles.sortButtonSelected,
              ]}
              onPress={() => setFilters({ ...filters, sortOrder: 'asc' })}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  filters.sortOrder === 'asc' && styles.optionTextSelected,
                ]}
              >
                Ascending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortButton,
                filters.sortOrder === 'desc' && styles.sortButtonSelected,
              ]}
              onPress={() => setFilters({ ...filters, sortOrder: 'desc' })}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  filters.sortOrder === 'desc' && styles.optionTextSelected,
                ]}
              >
                Descending
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 20,
    borderRadius: 20,
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
  salaryInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  salaryInputWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  salaryInputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  salaryInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  locationInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 8,
  },
  remoteButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    marginTop: 8,
  },
  remoteButtonSelected: {
    backgroundColor: '#007AFF',
  },
  remoteButtonText: {
    fontSize: 14,
    color: '#333',
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  sortButtonSelected: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
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
  skillsInputContainer: {
    marginBottom: 8,
  },
  skillInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 4,
  },
  skillChipText: {
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SearchFilter;