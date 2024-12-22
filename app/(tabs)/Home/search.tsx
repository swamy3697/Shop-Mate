// app/(tabs)/Home/search.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, ToastAndroid, Platform, Alert } from 'react-native';
import SearchBar from '@/app/components/searchBar';
import ItemCard from '@/app/components/itemCard';
import EmptySearchResult from '@/app/components/EmptySearchResults';
import Colors from '@/app/Colors';
import { DatabaseService } from '@/app/services/databaseService';
import { Item as DatabaseItem } from '@/app/models/schema';

interface ItemCardProps {
  id?: number;
  name: string;
  image?: string;
  quantity: number;
  quantityType: string;
}


const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<DatabaseItem[]>([]);
  const [showNewItemCard, setShowNewItemCard] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const dbItems = await DatabaseService.items.getAll();
      setItems(dbItems);
      setFilteredItems(dbItems);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const showNotification = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setFilteredItems(items);
      setShowNewItemCard(false);
      return;
    }

    // First, check for exact matches (case-insensitive)
    const exactMatches = items.filter(item => 
      item.name.toLowerCase() === text.toLowerCase()
    );

    if (exactMatches.length > 0) {
      setFilteredItems(exactMatches);
      setShowNewItemCard(false);
      return;
    }

    // Then, check for partial matches
    const partialMatches = items.filter(item =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );

    // If we have partial matches, show them along with the new item card
    setFilteredItems(partialMatches);
    
    // Always show the new item card when there's no exact match
    setShowNewItemCard(true);

  }, [items]);



  const handleDeleteItem = async (id: number) => {
    try {
      // First remove from the UI
      const newItems = items.filter(item => parseInt(item.id) !== id);
      setItems(newItems);
      setFilteredItems(prevFiltered => 
        prevFiltered.filter(item => parseInt(item.id) !== id)
      );
  
      // Then remove from the database
      await DatabaseService.items.delete(id.toString());
      showNotification('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to delete item', ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', 'Failed to delete item');
      }
    }
  };


  const handleClear = useCallback(() => {
    setSearchQuery('');
    setFilteredItems(items);
    setShowNewItemCard(false);
  }, [items]);

  const handleAddToShopList = async (item: ItemCardProps) => {
    try {
      await DatabaseService.shopList.addItem({
        name: item.name,
        quantity: item.quantity,
        quantityType: item.quantityType,
        imagePath: item.image
      });
      showNotification(`${item.name} added to shopping list`);
    } catch (error) {
      console.error('Error adding item to shop list:', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to add item', ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', 'Failed to add item');
      }
    }
  };

  const handleAddNewItem = async (item: ItemCardProps) => {
    try {
      const newItemData = {
        name: item.name,
        quantity: item.quantity,
        quantityType: item.quantityType,
        imagePath: item.image
      };

      const newItem = await DatabaseService.items.create(newItemData);
      setItems(prevItems => [...prevItems, newItem]);
      setFilteredItems(prevItems => [...prevItems, newItem]);
      setShowNewItemCard(false);

      await handleAddToShopList(item);
    } catch (error) {
      console.error('Error adding new item:', error);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to create new item', ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', 'Failed to create new item');
      }
    }
  };

  const renderItem = useCallback(({ item }: { item: DatabaseItem }) => (
    <ItemCard 
      item={{
        id: parseInt(item.id),
        name: item.name,
        image: item.imagePath,
        quantity: item.quantity,
        quantityType: item.quantityType
      }}
      onAdd={handleAddToShopList}
      onDelete={handleDeleteItem}
      isNewItem={false}
    />
  ), []);
  const getHeaderComponent = useCallback(() => {
    if (searchQuery.trim() !== '' && showNewItemCard) {
      const newItemCard = {
        name: searchQuery,
        quantity: 1,
        quantityType: 'piece'
      };

      return (
        <View style={styles.headerContainer}>
          <ItemCard
            item={newItemCard}
            onAdd={handleAddNewItem}
            isNewItem={true}
          />
          {filteredItems.length === 0 && (
            <EmptySearchResult searchTerm={searchQuery} />
          )}
        </View>
      );
    }
    return null;
  }, [searchQuery, showNewItemCard, filteredItems.length]);

  return (
    <View style={styles.container}>
      <SearchBar
        onClear={handleClear}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search for items..."
      />

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={getHeaderComponent}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    marginBottom: 10,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default SearchScreen;