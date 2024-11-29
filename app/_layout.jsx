import { View, Text, StyleSheet } from 'react-native'
import { Slot, Stack , useRouter, useSegments} from 'expo-router'
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';

//SplashScreen.preventAutoHideAsync(false);

const RootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="(explore)" options={{ headerShown: false }} />
    <Stack.Screen name="(DrawerScreens)" options={{ headerShown: false }} />
    <Stack.Screen name="search" options={{ headerShown: false }} />
  </Stack>
  )
}

export default RootLayout