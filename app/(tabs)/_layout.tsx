// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../Colors";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown:false,
      tabBarStyle: { backgroundColor: colors.primaryGreen } }}>
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarActiveTintColor:colors.white,

          tabBarInactiveBackgroundColor:colors.white,
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Account"
        options={{
          title: "Account",
          tabBarInactiveBackgroundColor:colors.white,
          tabBarActiveTintColor:colors.white,
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}