// app/(tabs)/Home/index.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from "react-native";
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

import EmptyDoodleContainer from "@/app/components/emptyDoodleContainer";
import Colors from "@/app/Colors";
import DummySearchBar from "@/app/components/dummySearchBar";
import ShopListItemCard from "@/app/components/shopListItemCard/ShopListItemCard";
import { DatabaseService } from "@/app/services/databaseService";
import { ShopListItem } from "@/app/models/schema";

export default function HomeScreen() {
  const [shopList, setShopList] = useState<ShopListItem[]>([]);

  const loadShopList = useCallback(async () => {
    try {
      const items = await DatabaseService.shopList.getAll();
      setShopList(items);
    } catch (error) {
      console.error('Error loading shop list:', error);
    }
  }, []);

  // Add useFocusEffect to reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadShopList();
    }, [loadShopList])
  );

  // Initial load
  useEffect(() => {
    loadShopList();
  }, [loadShopList]);

  const handleSearch = () => {
    router.push('/Home/search');
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await DatabaseService.shopList.toggleComplete(id);
      loadShopList(); // Reload the list to reflect changes
    } catch (error) {
      console.error('Error toggling item completion:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DatabaseService.shopList.delete(id);
      loadShopList(); // Reload the list to reflect changes
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      const items = await DatabaseService.shopList.getAll();
      for (const item of items) {
        await DatabaseService.shopList.delete(item.id);
      }
      loadShopList(); // Reload the list to reflect changes
    } catch (error) {
      console.error('Error clearing shop list:', error);
    }
  };

  const renderItem = useCallback(({ item }: { item: ShopListItem }) => (
    <ShopListItemCard
      item={item}
      onToggleComplete={handleToggleComplete}
      onDelete={handleDelete}
    />
  ), []);

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

      {/* Clear All Button */}
      {shopList.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearAll}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.white} />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}

      {/* Shopping List */}
      {shopList.length > 0 ? (
        <FlatList
          data={shopList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ratingYellow,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: 15,
    marginBottom: 10,
  },
  clearButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  listContainer: {
    flex: 1,
    
  },
});