import React, { useState } from "react";
import { View, TextInput, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FilterForm from "./SearchFilter";

const SearchInput = ({ placeholder, onSearch, onApplyFilters }) => {
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const handleApplyFilters = (filters) => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    setShowFilterForm(false);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Search..."}
        placeholderTextColor="gray"
        onChangeText={setSearchText}
        value={searchText}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      <TouchableOpacity 
        style={styles.searchIcon} 
        onPress={handleSearch}
        activeOpacity={0.7}
      >
        <Ionicons name="search" size={20} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => setShowFilterForm(true)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="tune-variant"
          size={20}
          color="black"
          style={styles.filterIcon}
        />
      </TouchableOpacity>
      <Modal
        visible={showFilterForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FilterForm
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
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    paddingRight: 40, // Increased to prevent text from going under the search icon
    backgroundColor: "#f0f0f0",
    borderRadius: 45,
    fontSize: 16,
    color: "black",
    borderEndColor: "black",
    borderWidth: 0.7,
  },
  searchIcon: {
    position: "absolute",
    right: 45,
    top: 15,
   // padding: 5, // Added padding to increase touch target
    zIndex: 1, // Ensure the touchable is above the input
  },
  filterIcon: {
    marginLeft: 10,
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