import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const SearchLayout = () => {
  return (
    <Stack >
      <Stack.Screen name="index" 
      options={{title: 'Search Results'}}
      />
    </Stack>
  )
}

export default SearchLayout