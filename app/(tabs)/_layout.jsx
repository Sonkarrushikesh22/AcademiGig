import { View, Text } from 'react-native'
import React from 'react'

const TabsLayout = () => {
  return (
<Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  )
}

export default TabsLayout