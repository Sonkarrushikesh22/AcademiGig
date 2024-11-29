import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const SearchLayout = () => {
  return (
    <Stack >
      <Stack.Screen name="filter" />
      <Stack.Screen name="index" />
    </Stack>
  )
}

export default SearchLayout