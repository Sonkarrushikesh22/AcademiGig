import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const SearchInput = ({ placeholder, onSearch, onFilter }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder || "Search..."}
        placeholderTextColor="gray"
        onChangeText={onSearch}
      />
      <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
      <Feather name="filter" size={20} color="black" style={styles.filterIcon} onPress={onFilter} />
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
    borderRadius:45,
    paddingHorizontal: 10,
    paddingRight: 30, // Space for search icon
    backgroundColor: "#f0f0f0",
    borderRadius: 45,
    fontSize: 16,
    color: "black",
  },
  searchIcon: {
    position: "absolute",
    right: 45,
    top: 15,
  },
  filterIcon: {
    marginLeft: 10,
  },
});

export default SearchInput;
