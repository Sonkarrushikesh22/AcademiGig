import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { Redirect, router } from "expo-router";

import { SafeAreaView } from 'react-native-safe-area-context';
import Img from "../assets/images/image.png";

const { width, height } = Dimensions.get('window');

const WelcomePage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
<View style={styles.container1}>
        <Text style={styles.titleText}>Become Independent Student with AcademiGig</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}
           onPress={() => router.push("/sign-in")}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
           onPress={() => router.push("/sign-up")}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={Img}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.exploreButton}>
            <Text style={styles.buttonText}>Explore Jobs</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
  },
  container1:{
flexDirection:'column',
marginRight:width*0.2,
  },
  titleText: {
    fontSize: width * 0.11,
    fontWeight: "bold",
    textAlign: "side",
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.02,
  },
  button: {
    backgroundColor: "#FF8C00",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: 25,
    marginHorizontal: width * 0.02,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'side',
    width: '100%',
    marginTop: height*0.03,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: width * 1.1,
    height: height * 0.55,
  },
  exploreButton: {
    position: 'absolute',
    top: height*0.2,
    right: 0,
    backgroundColor: '#6A5ACD',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.08,
    borderRadius: 25,
    zIndex: 1,
  },
});

export default WelcomePage;
