import React, { useState } from 'react';
import { View, Button, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Reusable Picker component
const PickerComponent = ({ label, selectedValue, onValueChange, options }) => (
  <View style={styles.fieldContainer}>
    <Text>{label}</Text>
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={styles.picker}
    >
      {options.map((option, index) => (
        <Picker.Item key={index} label={option.label} value={option.value} />
      ))}
    </Picker>
  </View>
);

const FilterForm = ({ onApplyFilters }) => {
  const theme = useTheme(); // Access theme for styling
  const [form, setForm] = useState({
    category: '',
    jobType: '',
    salaryRange: '',
    schedule: '',
    experienceLevel: '',
    remote: '',
    shiftTiming: '',
    startDate: new Date(),
    duration: '',
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleDateConfirm = (date) => {
    setForm((prevForm) => ({ ...prevForm, startDate: date }));
    setDatePickerVisibility(false);
  };

  const handleApplyFilters = () => {
    onApplyFilters(form);
  };

  return (
    <ScrollView style={styles.container}>
      <PickerComponent
        label="Job Category"
        selectedValue={form.category}
        onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
        options={[
          { label: 'Select a category', value: '' },
          { label: 'Restaurant', value: 'Restaurant' },
          { label: 'Retail', value: 'Retail' },
          { label: 'Office Work', value: 'Office Work' },
          { label: 'Delivery', value: 'Delivery' },
          { label: 'Customer Service', value: 'Customer Service' },
          { label: 'Education', value: 'Education' },
        ]}
      />

      <PickerComponent
        label="Job Type"
        selectedValue={form.jobType}
        onValueChange={(value) => setForm((prev) => ({ ...prev, jobType: value }))}
        options={[
          { label: 'Select job type', value: '' },
          { label: 'Part-Time', value: 'Part-Time' },
          { label: 'Full-Time', value: 'Full-Time' },
          { label: 'Internship', value: 'Internship' },
          { label: 'Contract', value: 'Contract' },
        ]}
      />

      <PickerComponent
        label="Salary Range"
        selectedValue={form.salaryRange}
        onValueChange={(value) => setForm((prev) => ({ ...prev, salaryRange: value }))}
        options={[
          { label: 'Select salary range', value: '' },
          { label: '< $500', value: '<500' },
          { label: '$500–$1000', value: '500-1000' },
          { label: '> $1000', value: '>1000' },
        ]}
      />

      <Text style={styles.label}>Start Date</Text>
      <Button title="Select Date" onPress={() => setDatePickerVisibility(true)} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <PickerComponent
        label="Duration"
        selectedValue={form.duration}
        onValueChange={(value) => setForm((prev) => ({ ...prev, duration: value }))}
        options={[
          { label: 'Select duration', value: '' },
          { label: 'Less than 1 month', value: '<1 month' },
          { label: '1–3 months', value: '1-3 months' },
          { label: '3–6 months', value: '3-6 months' },
          { label: '6 months or more', value: '6+ months' },
        ]}
      />

      <Button title="Apply Filters" onPress={handleApplyFilters} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default FilterForm;