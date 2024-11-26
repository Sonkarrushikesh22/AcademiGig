import React from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AppliedJobs from '../../app/DrawerScreens/appliedJobs';
import { TwoPointConicalGradient } from '@shopify/react-native-skia';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.8;

const CustomDrawer = ({ isOpen, onClose }) => {
  const router = useRouter();
  const translateX = React.useRef(new Animated.Value(DRAWER_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

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
                
                // Close the drawer
                onClose();
                
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

  const drawerItems = [
    { 
      title: 'Settings', 
      icon: 'settings-outline',
      onPress: () => {
        navigation.navigate('Settings');
        onClose();
      }
    },
    {
      title: 'Applied Jobs',
      icon: 'briefcase-outline',
      onPress: () => {
        router.push('/DrawerScreens/appliedJobs');
        onClose();
      }
    }
   
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.overlay} />
        </TouchableOpacity>
      )}

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {/* Drawer Header */}
        <View style={styles.drawerHeader}>
          <Text style={styles.headerText}>Menu</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Main Drawer Content */}
        <View style={styles.drawerContent}>
          {drawerItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.drawerItem}
              onPress={item.onPress}
            >
              <View style={styles.drawerItemContent}>
                <Ionicons name={item.icon} size={20} color="#000000" />
                <Text style={styles.drawerItemText}>{item.title}</Text>
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
            <View style={styles.drawerItemContent}>
              <Ionicons name="log-out-outline" size={20} color="#dc2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#ffffff',
    zIndex: 1001,
    elevation: 16,
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  drawerContent: {
    flex: 1,
    padding: 16,
  },
  drawerItem: {
    paddingVertical: 12,
  },
  drawerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutButton: {
    paddingVertical: 12,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#dc2626',
  },
});

export default CustomDrawer;