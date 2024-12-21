// app/(tabs)/Home/index.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { router } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

import EmptyDoodleContainer from "@/app/components/emptyDoodleContainer";
import Colors from "@/app/Colors";
import SearchBar from "@/app/components/searchBar";
import DummySearchBar from "@/app/components/dummySearchBar";

// Temporary type for shopping list items
interface ShopListItem {
  id: number;
  name: string;
  quantity: number;
  quantityType: string;
  itemType: string;
}

export default function HomeScreen() {
  const [shopList, setShopList] = useState<ShopListItem[]>([]);

  const handleSearch = () => {
    router.push('/Home/search');
  };



  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <DummySearchBar
          onSearch={handleSearch}
          onLocationPress={() => {}}
          placeholder="Search For Items"
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

   
      {/* Shopping List */}
      {shopList.length > 0 ? (
        <FlatList
          data={shopList}
          style={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              {/* TODO: Implement list item component */}
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <EmptyDoodleContainer />
      )}

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchBarContainer: {
    width: "100%",
    paddingHorizontal: 15,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  deleteButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: Colors.primaryGreen,
    padding: 10,
    borderRadius: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  listItem: {
    backgroundColor: Colors.lightGray,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primaryGreen,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});