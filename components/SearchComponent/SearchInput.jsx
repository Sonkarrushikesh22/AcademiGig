import React, { useState, useCallback, useEffect } from "react";
import { View, TextInput, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter, useLocalSearchParams } from "expo-router";
import FilterForm from "./SearchFilter";

const SearchInput = ({ onSearchResults, initialSearch = '', showFilterButton = true }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [searchText, setSearchText] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [lastAppliedFilters, setLastAppliedFilters] = useState({});

  const cleanFilters = (filters) => {
    const cleaned = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== undefined && 
        value !== null && 
        value !== '' && 
        value !== 'all' &&
        !(Array.isArray(value) && value.length === 0) &&
        !(key === 'minSalary' && value === 0) &&
        !(key === 'maxSalary' && value === 200000)
      ) {
        cleaned[key] = typeof value === 'boolean' ? value.toString() : value;
      }
    });
    return cleaned;
  };

  const handleSearch = useCallback(() => {
    setIsLoading(true);
    try {
      const searchParam = searchText.trim();
      const baseFilters = {
        search: searchParam || '',
        page: 1,
        limit: 10,
        sortBy: 'postedDate',
        sortOrder: 'desc'
      };

      const cleanedFilters = cleanFilters({
        ...baseFilters,
        ...currentFilters
      });
  
      console.log('SearchInput sending filters:', cleanedFilters);
  
      if (onSearchResults) {
        onSearchResults(cleanedFilters);
      } else {
        const queryParams = new URLSearchParams();
        Object.entries(cleanedFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
        router.push(`/search?${queryParams.toString()}`);
      }
      
      // Store the applied filters
      setLastAppliedFilters(currentFilters);
      // Reset current filters after search
      setCurrentFilters({});
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchText, currentFilters, onSearchResults, router]);

  const handleApplyFilters = useCallback((filters) => {
    if (Object.keys(filters).length === 0) {
      setCurrentFilters({});
      setLastAppliedFilters({});
    } else {
      const cleanedFilters = cleanFilters(filters);
      if (onSearchResults) {
        onSearchResults(filters);
      }
    }
    setShowFilterForm(false);
  }, [onSearchResults]);

  // When opening filter form, restore last applied filters
  const handleOpenFilter = () => {
    setCurrentFilters(lastAppliedFilters);
    setShowFilterForm(true);
  };

  useEffect(() => {
    if (params) {
      const initialFilters = {};
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          initialFilters[key] = value;
        }
      });
      setCurrentFilters(cleanFilters(initialFilters));
      setLastAppliedFilters(cleanFilters(initialFilters));
      if (params.search) {
        setSearchText(params.search);
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search jobs..."
          placeholderTextColor="gray"
          onChangeText={setSearchText}
          value={searchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity 
          style={styles.searchIcon} 
          onPress={handleSearch}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="gray" />
          ) : (
            <Ionicons name="search" size={20} color="gray" />
          )}
        </TouchableOpacity>
        {showFilterButton && (
          <TouchableOpacity 
            style={styles.filterIcon} 
            onPress={handleOpenFilter}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name="tune-variant" 
              size={20} 
              color={Object.keys(lastAppliedFilters).length > 0 ? "#007AFF" : "black"} 
            />
          </TouchableOpacity>
        )}
      </View>
      <Modal
        visible={showFilterForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FilterForm
              initialFilters={currentFilters}
              onApplyFilters={handleApplyFilters}
              onClose={() => setShowFilterForm(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 45,
    borderWidth: 0.9,
    borderColor: "black",
    paddingHorizontal: 10,
    marginBottom: 1,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "black",
  },
  searchIcon: {
    marginHorizontal: 5,
  },
  filterIcon: {
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
});

export default SearchInput;