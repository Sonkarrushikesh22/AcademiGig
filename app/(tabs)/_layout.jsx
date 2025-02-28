import { useState, useEffect } from 'react';
import { Keyboard, View, StyleSheet, Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

const TabsLayout = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBarStyle,
          isKeyboardVisible && styles.hiddenTabBar,
        ],
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="home" color={color} />,
         // tabBarItemStyle: styles.tabBarItemStyle,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="compass" color={color} />,
         // tabBarItemStyle: styles.tabBarItemStyle,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="bookmark" color={color} />,
          //tabBarItemStyle: styles.tabBarItemStyle,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="user" color={color} />,
          //tabBarItemStyle: styles.tabBarItemStyle,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    height: 70,
    borderRadius: 35,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        paddingBottom: 0,
      },
      android: {
        paddingTop: 0,
        justifyContent: 'center',
      },
    }),
  },
  // tabBarItemStyle: {
  //   ...Platform.select({
  //     ios: {
  //     },
  //     android: {
  //      // paddingBottom: 5,
  //     },
  //   }),
  // },
  hiddenTabBar: {
    marginBottom: -70,
  },
});

export default TabsLayout;