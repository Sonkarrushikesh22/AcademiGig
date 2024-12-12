import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";

const ExploreLayout = () => {
  const { category } = useGlobalSearchParams();
  
  return (
    <Stack>
      <Stack.Screen 
        name="[id]"
        options={{
          title: category ? `${category} Jobs` : 'Jobs',
        }}
      />
      <Stack.Screen 
        name="maps"
        options={{
          title: 'Jobs Near You',
        }} />
    </Stack>  
  )
}

export default ExploreLayout