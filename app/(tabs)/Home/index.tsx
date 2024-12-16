// app/(tabs)/home/index.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import LocationSearchBar from "@/app/components/LocationSearchBar";

export default function HomeScreen() {
  const handleSearch = (location: string) => {
    console.log("Search button clicked", location);
  };

  const onLiveLocationBtnClicked = () => {
    console.log("Live Location button clicked");
  };

  return (
    <View style={styles.container}>
      {/* Location Search Bar */}
      <View style={styles.searchBarContainer}>
        <LocationSearchBar
          onSearch={handleSearch}
          onLocationPress={onLiveLocationBtnClicked}
          placeholder="Search a place"
        />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Other content */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBarContainer: {
    width: "100%", // Full width
    paddingHorizontal: 15,
    marginTop: 10, // Adjust spacing if needed
  },
  mainContent: {
    flex: 1,
    padding: 15,
  },
});
