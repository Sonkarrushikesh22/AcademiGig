import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const HeaderTabLayout = () => {
  return (
   <Stack screenOptions={{ headerShown: true }}>
    <Stack.Screen name="chat" />
    <Stack.Screen name="notifications" />
   </Stack>
  )
}

export default HeaderTabLayout