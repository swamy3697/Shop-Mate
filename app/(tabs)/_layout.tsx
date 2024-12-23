import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors,ColorOpacity } from '@/app/Colors';
import { StatusBar, Platform } from "react-native";


export default function TabLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryGreen} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.primaryGreen,
            height: Platform.OS === "android" ? 55 : 50,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            tabBarActiveTintColor: Colors.white,
            tabBarInactiveBackgroundColor: Colors.white,
            tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "settings",
            tabBarInactiveBackgroundColor: Colors.white,
            tabBarActiveTintColor: Colors.white,
            tabBarIcon: ({ color }) => <FontAwesome name="gear" size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
