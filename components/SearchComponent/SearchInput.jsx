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
      <View style={styles.inputContainer}>
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
          style={styles.filterIcon} 
          onPress={() => setShowFilterForm(true)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="tune-variant" size={20} color="black" />
        </TouchableOpacity>
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
    marginBottom:1
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
