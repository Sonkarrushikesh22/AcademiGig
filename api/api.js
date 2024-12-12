// api/api.js
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get the appropriate base URL based on platform
// const getBaseURL = () => {
//   if (Platform.OS === 'android') {
//     // Android emulator runs in a VM, so localhost points to the VM, not your machine
//     return 'http://10.0.2.2:8080/api/v1';
//   } else if (Platform.OS === 'ios') {
//     // iOS simulator can use localhost
//     return 'http://localhost:8080/api/v1';
//   } else {
//     // For physical devices, use your computer's local IP address
//     // Example: return 'http://192.168.1.100:8080/api/v1';
//     return 'http://192.168.1.1:8080/api/v1';
//   }
// };

const getBaseURL = () => 'https://c522-115-98-232-116.ngrok-free.app/api/v1';

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for including token and debugging
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`🚀 [API] ${config.method.toUpperCase()} ${config.url}`, config.data || '');
    } catch (error) {
      console.log('❌ [API] Error retrieving token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    console.log('❌ [API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    console.log(`✅ [API] Response:`, response.data);
    return response;
  },
  (error) => {
    console.log('❌ [API] Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default API;
