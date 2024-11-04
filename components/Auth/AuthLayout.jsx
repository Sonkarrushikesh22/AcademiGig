import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * @param {Object} props
 * @param {Object} props.styles - Styles object
 * @param {string} props.alternateAuthText - Text for alternate auth option
 * @param {string} props.alternateAuthAction - Action text for alternate auth
 * @param {string} props.skipText - Text for skip button
 * @param {Function} props.onAlternateAuthPress - Handler for alternate auth press
 * @param {Function} props.onSkipPress - Handler for skip button press
 */
const AuthHeader = memo(({
  styles,
  alternateAuthText,
  alternateAuthAction,
  skipText,
  onAlternateAuthPress,
  onSkipPress
}) => (
  <View style={styles.headerContainer}>
    <View>
      <Text style={styles.headerText}>{alternateAuthText}</Text>
      <TouchableOpacity onPress={onSkipPress} style={styles.skipButton}>
        <Text style={styles.skipText}>{skipText}</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={onAlternateAuthPress}>
      <Text style={styles.getStartedText}>{alternateAuthAction}</Text>
    </TouchableOpacity>
  </View>
));

/**
 * @param {Object} props
 * @param {Object} props.styles - Styles object
 * @param {string} props.dividerText - Text for the social auth divider
 */
const SocialButtons = memo(({ styles, dividerText }) => (
  <>
    <View style={styles.dividerContainer}>
      <View style={styles.line} />
      <Text style={styles.orText}>{dividerText}</Text>
      <View style={styles.line} />
    </View>
    <View style={styles.socialContainer}>
      <TouchableOpacity style={styles.socialButton}>
        <Image
          // source={require('../../assets/images/google-icon.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image
          // source={require('../../assets/images/apple-icon.png')}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Apple</Text>
      </TouchableOpacity>
    </View>
  </>
));

/**
 * AuthLayout component for sign-in and sign-up screens
 * @param {Object} props
 * @param {Object} props.styles - Styles object
 * @param {React.ReactNode} props.children - Child components (form fields)
 * @param {string} [props.title="Welcome Back"] - Main title
 * @param {string} [props.subtitle="Enter your details below"] - Subtitle
 * @param {string} [props.alternateAuthText="Don't have an account?"] - Alternate auth text
 * @param {string} [props.alternateAuthAction="Get Started"] - Alternate auth action text
 * @param {string} [props.skipText="Skip"] - Text for skip button
 * @param {Function} props.onAlternateAuthPress - Handler for alternate auth press
 * @param {Function} props.onSkipPress - Handler for skip button press
 * @param {string} [props.socialDividerText="Or sign in with"] - Social auth divider text
 */
export const AuthLayout = memo(({
  styles,
  children,
  title = "Welcome Back",
  subtitle = "Enter your details below",
  alternateAuthText = "Don't have an account?",
  alternateAuthAction = "Get Started",
  skipText = "Skip",
  onAlternateAuthPress,
  onSkipPress,
  socialDividerText = "Or sign in with"
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
        <AuthHeader
          styles={styles}
          alternateAuthText={alternateAuthText}
          alternateAuthAction={alternateAuthAction}
          skipText={skipText}
          onAlternateAuthPress={onAlternateAuthPress}
          onSkipPress={onSkipPress}
        />
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>AcademiGig</Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>{title}</Text>
        <Text style={styles.subText}>{subtitle}</Text>
        {children}
        <SocialButtons styles={styles} dividerText={socialDividerText} />
      </View>
    </SafeAreaView>
  );
});