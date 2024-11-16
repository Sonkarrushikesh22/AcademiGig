import React, { useState, useCallback ,useEffect} from 'react';
import { TextInput, TouchableOpacity, Text, Alert, ActivityIndicator, View,BackHandler } from 'react-native';
import { AuthLayout } from '../../components/Auth/AuthLayout';
import { useAuthStyles } from '../../components/Auth/AuthStyles';
import { useRouter } from 'expo-router';
import API from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const router = useRouter();
  const styles = useAuthStyles();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

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

  const handleSignIn = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Make sign-in request
      const { data } = await API.post('/auth/user/login', formData);
      // Store the token and navigate to the home screen
      await AsyncStorage.setItem('authToken', data.token);
      router.replace('/home');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to sign in. Please try again later.';
      setErrors(prev => ({
        ...prev,
        email: 'Invalid email or password',
        password: 'Invalid email or password'
      }));
      Alert.alert('Sign In Failed', message);
    } finally {
      setIsLoading(false);
    }
  }, [formData, router]);

  const handleNavigateSignUp = useCallback(() => {
    router.push('/sign-up');
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
      title="Welcome Back"
      subtitle="Enter your details below"
      alternateAuthText="Don't have an account?"
      alternateAuthAction="Get Started"
      onAlternateAuthPress={handleNavigateSignUp}
      socialDividerText="Or sign in with"
    >
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
        style={[styles.authButton, isLoading && styles.authButtonDisabled]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.authButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default SignIn;
