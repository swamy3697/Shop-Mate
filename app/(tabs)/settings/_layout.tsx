import { Stack } from "expo-router";
import { Colors,ColorOpacity } from '@/app/Colors';

export default function AccountLayout() {
  return (
    <Stack screenOptions={{ 
        headerShown: true, // Keep the default header
        headerStyle: { backgroundColor: Colors.primaryGreen }, // Change the header background to green
        headerTintColor: "#FFFFFF", // Change the text/icon color to white
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },

     }}>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
    </Stack>
  );
}
