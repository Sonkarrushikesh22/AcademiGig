// components/auth/AuthStyles.js
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { useMemo } from 'react';

const { width, height } = Dimensions.get('window');

// Constants for consistent spacing and styling
const SPACING = {
  xs: height * 0.01,
  sm: height * 0.015,
  md: height * 0.02,
  lg: height * 0.025,
  xl: height * 0.03,
  xxl: height * 0.04
  
};

const COLORS = {
  primary: '#0756f2',
  accent: '#4F46E5',
  text: {
    primary: '#111827',
    secondary: '#6B7280'
  },
  border: '#adadad',
  white: '#fff',
  background: {
    light: '#E5E7EB'
  }
};

const TYPOGRAPHY = {
  logo: 52,
  heading: 30,
  body: 14,
  input: 16
};

const DIMENSIONS = {
  inputHeight: height * 0.06,
  borderRadius: {
    sm: 10,
    md: 15,
    lg: 35
  }
};

// Memoized styles creation to prevent unnecessary recalculations
export const useAuthStyles = () => {
  return useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.primary,
      paddingHorizontal: 20,
    },
    container1: {
      minHeight: height * 0.20,
      //paddingBottom: height*0.01,
      flexShrink: 1
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: height * 0.02,
      marginBottom: height * 0.02,
    },
    headerText: {
      fontSize: TYPOGRAPHY.body,
      color: COLORS.white,
    },
    getStartedText: {
      fontSize: TYPOGRAPHY.body,
      color: COLORS.white,
      fontWeight: 'bold',
    },
    logoContainer: {
      alignItems: 'center',
      marginVertical: height*0.10,
      //paddingTop: height*0.065,
    },
    logoText: {
      fontSize: TYPOGRAPHY.logo,
      fontWeight: 'bold',
      color: COLORS.white,
    },
    formContainer: {
      backgroundColor: COLORS.white,
      padding: 20,
      borderTopLeftRadius: DIMENSIONS.borderRadius.lg,
      borderTopRightRadius: DIMENSIONS.borderRadius.lg,
      marginHorizontal: -20,
      //marginTop: height*0.05,
      elevation: Platform.select({ android: 5, ios: 0 }), // Platform-specific shadow
      shadowColor: COLORS.text.primary, // iOS shadow
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      //flex: 1,
      flexGrow: 1
    },
    welcomeText: {
      fontSize: TYPOGRAPHY.heading,
      fontWeight: 'bold',
      color: COLORS.text.primary,
      textAlign: 'center',
      marginBottom: SPACING.sm,
      
    },
    subText: {
      fontSize: TYPOGRAPHY.body,
      color: COLORS.text.secondary,
      textAlign: 'center',
      marginBottom: SPACING.lg,
    },
    input: {
      backgroundColor: COLORS.white,
      borderColor: COLORS.border,
      borderWidth: 1,
      borderRadius: DIMENSIONS.borderRadius.md,
      paddingHorizontal: 15,
      paddingVertical: SPACING.xs,
      fontSize: TYPOGRAPHY.input,
      color: COLORS.text.primary,
      marginBottom: SPACING.md,
      height: DIMENSIONS.inputHeight,
    },
    authButton: {
      backgroundColor: COLORS.accent,
      height: DIMENSIONS.inputHeight,
      borderRadius: DIMENSIONS.borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center', // Added for better vertical centering
      marginBottom: 10,
    },
    authButtonText: {
      color: COLORS.white,
      fontSize: TYPOGRAPHY.input,
      fontWeight: 'bold',
    },
    forgotText: {
      color: COLORS.accent,
      textAlign: 'center',
      marginVertical: SPACING.md,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 'auto',
      paddingTop: SPACING.md,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: COLORS.background.light,
    },
    orText: {
      textAlign: 'center',
      color: COLORS.text.secondary,
      marginBottom: SPACING.md,
      paddingHorizontal: 3,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: SPACING.md,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.background.light,
      padding: SPACING.md,
      borderRadius: DIMENSIONS.borderRadius.sm,
      width: '48%',
      justifyContent: 'center', // Added for better centering
    },
    socialIcon: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    socialText: {
      fontSize: TYPOGRAPHY.body,
      color: COLORS.text.primary,
    },
  }), []); // Empty dependency array since values are constants
};