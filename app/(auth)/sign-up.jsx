import React, { useState, useCallback } from 'react';
import { TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthLayout } from '../../components/Auth/AuthLayout';
import { useAuthStyles } from '../../components/Auth/AuthStyles';
import { useRouter } from 'expo-router';
import API from '../../api/api';

const SignUp = () => {
  const router = useRouter();
  const styles = useAuthStyles();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const handleSignUp = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await API.post('/auth/user/register', formData);
      
      // Save the token in AsyncStorage
      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem('authToken', token);
      }

      Alert.alert(
        'Success',
        [
          {
            text: 'OK',
            onPress: () => router.push('/home')
          }
        ]
      );
    } catch (error) {
      const message = error.response?.data?.message || 
                     'Unable to create account. Please try again later.';
      
      if (error.response?.status === 409) {
        setErrors(prev => ({
          ...prev,
          email: 'This email is already registered'
        }));
      }
      
      Alert.alert('Sign Up Failed', message);
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  const handleNavigateSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  const renderError = (field) => {
    if (errors[field]) {
      return <Text style={styles.errorText}>{errors[field]}</Text>;
    }
    return null;
  };

  return (
    <AuthLayout
      styles={styles}
      title="Get Started"
      subtitle="Enter your details below"
      alternateAuthText="Already have an account?"
      alternateAuthAction="Sign In"
      onAlternateAuthPress={handleNavigateSignIn}
      socialDividerText="Or sign up with"
    >
      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, errors.username && styles.inputError]} 
          placeholder="Username" 
          keyboardType="default" 
          placeholderTextColor="#aaa"
          value={formData.username}
          onChangeText={(value) => handleChange('username', value)}
          autoCapitalize="words"
          editable={!isLoading}
        />
        {renderError('username')}
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, errors.email && styles.inputError]} 
          placeholder="Email Address" 
          keyboardType="email-address" 
          placeholderTextColor="#aaa"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          autoCapitalize="none"
          editable={!isLoading}
        />
        {renderError('email')}
      </View>

      <View style={styles.inputContainer}>
        <TextInput 
          style={[styles.input, errors.password && styles.inputError]} 
          placeholder="Password" 
          secureTextEntry 
          placeholderTextColor="#aaa"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          editable={!isLoading}
        />
        {renderError('password')}
      </View>

      <TouchableOpacity 
        style={[
          styles.authButton,
          isLoading && styles.authButtonDisabled
        ]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.authButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default SignUp;
