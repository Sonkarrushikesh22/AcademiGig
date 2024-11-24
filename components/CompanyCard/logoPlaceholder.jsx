// components/LogoPlaceholder.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LogoPlaceholder = ({ size = 50, color = '#718096' }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <MaterialCommunityIcons 
        name="office-building" 
        size={size * 0.6} 
        color={color} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
  },
});

export default LogoPlaceholder;