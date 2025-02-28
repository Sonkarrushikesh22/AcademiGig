// File: app/menu.jsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const MenuScreen = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Show confirmation dialog
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
              try {
                // Clear all authentication related data
                await AsyncStorage.multiRemove([
                  'authToken',
                  'userData',
                  // Add any other auth-related keys you're storing
                ]);
                
                // Navigate to login screen
                router.replace('/(auth)/sign-in');
              } catch (error) {
                Alert.alert(
                  "Error",
                  "Failed to logout. Please try again.",
                  [{ text: "OK" }]
                );
                console.error('Logout error:', error);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const menuItems = [
    { 
      title: 'Settings', 
      icon: 'settings-outline',
      onPress: () => {
        // Navigate to settings when implemented
        // router.push('/settings'); // Uncomment when you have a settings page
        Alert.alert("Coming Soon", "Settings page is under development");
      }
    },
    {
      title: 'Applied Jobs',
      icon: 'briefcase-outline',
      onPress: () => {
        router.push('/appliedJobs');
      }
    }
  ];

  return (
    <View style={styles.container}>
      {/* Menu Content */}
      <View style={styles.menuContent}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon} size={24} color="#000000" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <View style={styles.menuItemContent}>
            <Ionicons name="log-out-outline" size={24} color="#dc2626" />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32, // Same size as back button for proper centering
  },
  menuContent: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 16,
  },
  logoutSection: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginBottom:5,
  },
  logoutButton: {
    paddingVertical: 10,
  },
  logoutText: {
    fontSize: 18,
    marginLeft: 16,
    color: '#dc2626',
    fontWeight: '500',
  },
});

export default MenuScreen;