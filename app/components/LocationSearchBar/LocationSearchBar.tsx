import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface LocationSearchBarProps {
  onSearch: (query: string) => void;
  onLocationPress: () => void;
  placeholder?: string;
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  onSearch,
  onLocationPress,
  placeholder = "Search a place...",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleLocationPress = () => {
    onLocationPress();
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={handleLocationPress} style={styles.iconContainer}>
        <Ionicons name="location-sharp" size={24} color="#75B565"/>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      <View style={styles.divider} />
      <TouchableOpacity onPress={handleSearch} style={styles.iconContainer}>
        <Ionicons name="search" size={24} color="#75B565" />
      </TouchableOpacity>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    width: "100%", 
  },
  iconContainer: {
    padding: 5,
  },
  searchInput: {
    flex: 1, // Fills remaining space
    marginHorizontal: 10,
    fontSize: 16,
  },
  divider: {
    height: "70%",
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
});

export default LocationSearchBar;
