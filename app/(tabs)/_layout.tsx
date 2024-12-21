import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../Colors";
import { StatusBar, Platform } from "react-native";
import Colors from "../Colors";

export default function TabLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryGreen} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.primaryGreen,
            height: Platform.OS === "android" ? 55 : 50,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            tabBarActiveTintColor: colors.white,
            tabBarInactiveBackgroundColor: colors.white,
            tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "settings",
            tabBarInactiveBackgroundColor: colors.white,
            tabBarActiveTintColor: colors.white,
            tabBarIcon: ({ color }) => <FontAwesome name="gear" size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
