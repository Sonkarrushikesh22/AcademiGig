import { View, Text, StyleSheet } from 'react-native'
import { Slot, Stack , useRouter, useSegments} from 'expo-router'
import * as SplashScreen from 'expo-splash-screen';

import React from 'react'

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
  </Stack>

  )
}

export default RootLayout