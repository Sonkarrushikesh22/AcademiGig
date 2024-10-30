import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';

const Saved = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(savedJobs); // Assuming `savedJobs` is an array of your saved job data.

  const savedJobs = [
    { id: '1', title: 'Restaurant Server' },
    { id: '2', title: 'Retail Associate' },
    { id: '3', title: 'Office Assistant' },
    { id: '4', title: 'Delivery Driver' },
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = savedJobs.filter((job) =>
        job.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(savedJobs);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search saved jobs"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text style={styles.jobTitle}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noResultsText}>No saved jobs found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  jobItem: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  jobTitle: {
    fontSize: 16,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default Saved;