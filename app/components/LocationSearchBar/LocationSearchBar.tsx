// app/components/LocationSearchBar/LocationSearchBar.tsx
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import Colors from "@/app/Colors";

interface LocationSearchBarProps {
  onSearch: (query: string) => void;
  onLocationPress: () => void;
  placeholder?: string;
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  placeholder = "Search a place...",
}) => {
  const handlePress = () => {
    router.push('/Home/search');
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.searchContent}>
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#888"
          editable={false} // Make input non-editable
          pointerEvents="none" // Disable pointer events
        />
        <View style={styles.divider} />
        <View style={styles.iconContainer}>
          <Ionicons name="search" size={24} color={Colors.lightGreen} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    height: 50,
    width: "100%",
  },
  searchContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  iconContainer: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: "#888",
  },
  divider: {
    height: "70%",
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
});

export default LocationSearchBar;