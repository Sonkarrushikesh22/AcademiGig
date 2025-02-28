import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Title } from 'react-native-paper';

const DrawerLayout = () => {
  return (
    <Stack >
      <Stack.Screen name="appliedJobs"
      options={
        {title: 'Applied Jobs'}
      }
      />
       <Stack.Screen name="menu"
      options={
        {title: 'Menu'}
      }
      />
    </Stack>
  )
}

export default DrawerLayout