import { View, Text, StyleSheet } from 'react-native'
import { Slot, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen';

import React from 'react'

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name ="index" options={{headerShown: false}}/>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  )
}

export default RootLayout