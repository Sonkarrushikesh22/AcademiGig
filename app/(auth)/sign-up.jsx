import React, { useCallback } from 'react';
import { TextInput, TouchableOpacity, Text } from 'react-native';
import { AuthLayout } from '../../components/Auth/AuthLayout';
import { useAuthStyles } from '../../components/Auth/AuthStyles';
import { useRouter } from 'expo-router';

const SignIn = () => {
  const router = useRouter();
  const styles = useAuthStyles ();
  
  const handleSkipToHome = useCallback(() => {
    router.push('/home');
  }, [router]);

  const handleSignIn = useCallback(() => {
    router.push('/(app)');
  }, [router]);

  const handleNavigateSignUp = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  return (
    <AuthLayout
      styles={styles}
      title="Get Started"
      subtitle="Enter your details below"
      alternateAuthText="Already have an account?"
      alternateAuthAction="Sign In"
      onSkipPress={handleSkipToHome} // Added skip action here
      skipText="Skip" // Added skip text to display on button
      onAlternateAuthPress={handleNavigateSignUp}
      socialDividerText="Or sign up with"
    >
         <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        keyboardType="text" 
        placeholderTextColor="#aaa"
      />
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
        <Text style={styles.authButtonText}>Sign Up</Text>
      </TouchableOpacity>
      
    </AuthLayout>
  );
};

export default SignIn;