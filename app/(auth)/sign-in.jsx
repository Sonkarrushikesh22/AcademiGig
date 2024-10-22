import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SignIn = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Don't have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>AcademiGig</Text>
      </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subText}>Enter your details below</Text>

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

        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot your password?</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or sign in with</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={{ uri: 'google-icon-url' }} style={styles.socialIcon} />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image source={{ uri: 'facebook-icon-url' }} style={styles.socialIcon} />
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0756f2',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  container1:{
    height:height*0.4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.16,
    marginBottom: height * 0.03,
  },
  headerText: {
    fontSize: 14,
    color: 'white',
  },
  getStartedText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
   paddingTop: height*0.04
  },
  logoText: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginHorizontal: -20,
    elevation: 5,
    height: height*0.8,
  },
  welcomeText: {
    fontSize: 30, 
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: height*0.02, 
  },
  subText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: height*0.03,
  },
  input: {
    backgroundColor: '#fff',
    borderColor:'#adadad',
    borderWidth:1,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: height*0.015,
    fontSize: 16,
    color: '#111827',
    marginBottom: height*0.025,
    height: height*0.06, 
  },
  signInButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: height*0.015,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    height:height*0.06
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#4F46E5',
    textAlign: 'center',
    marginVertical: height*0.02,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
    
  },
  orText: {
    textAlign: 'center',
    color: '#6B7280',
    marginVertical: height*0.04,
    paddingHorizontal: 3
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: height*0.02,

  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '48%',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialText: {
    fontSize: 14,
    color: '#111827',
  },
});

export default SignIn;
