import { View, Text } from 'react-native'
import { Redirect, Stack } from "expo-router";

import React from 'react'

const TabsLayout = () => {
  return (
<Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name="home" />
      <Stack.Screen name="explore" />
    </Stack>
  )
}

export default TabsLayout