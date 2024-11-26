import { View, Text } from 'react-native'
import { Redirect, Stack } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react'

const TabsLayout = () => {
  return (
    
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: 'blue',
      tabBarShowLabel: false,
      tabBarStyle: {
       // backgroundColor: "#161622",
        //borderTopWidth: 0.5,
        //borderTopColor: "#232533",
        height: 70,
        alignItems: 'center',
        borderRadius:35,
         marginHorizontal:15,
        marginBottom:15,
      backgroundColor: 'white',
         
      },
      }} >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false ,
          title: 'Home',
          
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false ,
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="compass" color={color} />,
        }}
      />
         <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          headerShown: false ,
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="bookmark" color={color} />,
        }}
      />
         <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
         headerShown: false ,
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="user" color={color} />,
        }}
      />
    </Tabs>
    
    
  );
}

export default TabsLayout
