import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, FlatList, StyleSheet, ToastAndroid, Platform, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import debounce from 'lodash/debounce';
import SearchBar from '@/app/components/searchBar';
import ItemCard from '@/app/components/itemCard';
import EmptySearchResult from '@/app/components/EmptySearchResults';
import { Colors } from '@/app/Colors';
import { DatabaseService } from '@/app/services/databaseService';
import { Item as DatabaseItem } from '@/app/models/schema';
import ItemDialog from '@/app/components/itemDialog';

interface ItemCardProps {
  id?: string;
  name: string;
  imagePath?: string;
  quantity: number;
  quantityType: string;
}

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  // Memoize filtered items to prevent unnecessary recalculations
  const { filteredItems, showNewItemCard } = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    
    if (!trimmedQuery) {
      return { filteredItems: items, showNewItemCard: false };
    }

    // First, check for exact matches (case-insensitive)
    const exactMatches = items.filter(item => 
      item.name.toLowerCase() === trimmedQuery
    );

    if (exactMatches.length > 0) {
      return { filteredItems: exactMatches, showNewItemCard: false };
    }

    // Then, check for partial matches
    const partialMatches = items.filter(item =>
      item.name.toLowerCase().includes(trimmedQuery)
    );

    return { 
      filteredItems: partialMatches, 
      showNewItemCard: true 
    };
  }, [items, searchQuery]);

  const loadItems = useCallback(async () => {
    if (!isDialogVisible) { // Only load if dialog is not visible
      try {
        setIsLoading(true);
        const dbItems = await DatabaseService.items.getAll();
        setItems(dbItems);
      } catch (error) {
        console.error('Error loading items:', error);
        showNotification('Failed to load items', true);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isDialogVisible]); 

  useFocusEffect(
    useCallback(() => {
      if (!isDialogVisible) { // Only load when dialog is not visible
        loadItems();
      }
    }, [loadItems, isDialogVisible])
  );

  const showNotification = (message: string, isError: boolean = false) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(isError ? 'Error' : 'Success', message);
    }
  };

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((text: string) => {
      setSearchQuery(text);
    }, 300), // 300ms delay
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = useCallback((text: string) => {
    // Update the input value immediately for UI responsiveness
    setSearchQuery(text);
    // Debounce the actual search operation
    debouncedSearch(text);
  }, [debouncedSearch]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleAddToShopList = useCallback(async (item: ItemCardProps) => {
    try {
      await DatabaseService.shopList.addItem({
        name: item.name,
        quantity: item.quantity,
        quantityType: item.quantityType,
        imagePath: item.imagePath
      });
    } catch (error) {
      console.error('Error adding item to shop list:', error);
      showNotification('Failed to add item to shop list', true);
    }
  }, []);

  const handleAddNewItem = useCallback(async (item: ItemCardProps) => {
    try {
      const newItemData = {
        name: item.name,
        quantity: item.quantity,
        quantityType: item.quantityType,
        imagePath: item.imagePath
      };
      const newItem = await DatabaseService.items.create(newItemData);
      setItems(prevItems => [...prevItems, newItem]);
      showNotification('Item created successfully');
    } catch (error) {
      console.error('Error adding new item:', error);
      showNotification('Failed to create new item', true);
    }
  }, []);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    try {
      await DatabaseService.items.delete(itemId);
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
      showNotification('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('Failed to delete item', true);
    }
  }, []);

  const handleItemPress = (item: DatabaseItem) => {
    setSelectedItemId(item.id);
    setIsDialogVisible(true);
    
  };

  const renderItem = useCallback(({ item }: { item: DatabaseItem }) => (
    <ItemCard 
      item={{
        id: item.id,
        name: item.name,
        imagePath: item.imagePath,
        quantity: item.quantity,
        quantityType: item.quantityType
      }}
      onAdd={handleAddToShopList}
      onDelete={handleDeleteItem}
      onPress={() => handleItemPress(item)}
      isNewItem={false}
    />
  ), [handleAddToShopList, handleDeleteItem, handleItemPress]);

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
  }, [searchQuery, showNewItemCard, filteredItems.length, handleAddNewItem]);

  const keyExtractor = useCallback((item: DatabaseItem) => item.id, []);

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClear}
        placeholder="Search and add items..."
      />
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={getHeaderComponent}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
      />

<ItemDialog
  visible={isDialogVisible}
  itemId={selectedItemId}
  onClose={() => {
    setIsDialogVisible(false);
    setSelectedItemId(null);
  }}
  onItemUpdated={async () => {
    // Make this async and wait for loadItems
    await loadItems();
  }}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
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