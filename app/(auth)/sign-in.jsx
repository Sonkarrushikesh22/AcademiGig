import React, { useCallback } from 'react';
import { TextInput, TouchableOpacity, Text } from 'react-native';
import { AuthLayout } from '../../components/Auth/AuthLayout';
import { useAuthStyles } from '../../components/Auth/AuthStyles';
import { useRouter } from 'expo-router';

const SignIn = () => {
  const router = useRouter();
  const styles = useAuthStyles ();
  
  const handleSignIn = useCallback(() => {
    router.push('/(app)');
  }, [router]);

  const handleNavigateSignUp = useCallback(() => {
    router.push('/sign-up');
  }, [router]);

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
      <TextInput 
        style={styles.input} 
        placeholder="Email Address" 
        keyboardType="email-address" 
        placeholderTextColor="#aaa"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity 
        style={styles.authButton}
        onPress={handleSignIn}
      >
        <Text style={styles.authButtonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default SignIn;