import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, ToastAndroid, Platform, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import SearchBar from '@/app/components/searchBar';
import ItemCard from '@/app/components/itemCard';
import EmptySearchResult from '@/app/components/EmptySearchResults';
import { Colors,ColorOpacity } from '@/app/Colors';
import { DatabaseService } from '@/app/services/databaseService';
import { Item as DatabaseItem } from '@/app/models/schema';
import EmptyDoodleContainer from '@/app/components/emptyDoodleContainer';

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
  const [filteredItems, setFilteredItems] = useState<DatabaseItem[]>([]);
  const [showNewItemCard, setShowNewItemCard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const dbItems = await DatabaseService.items.getAll();
      setItems(dbItems);
      
      // Reapply current search filter to the new items
      if (searchQuery.trim() !== '') {
        handleSearch(searchQuery);
      } else {
        setFilteredItems(dbItems);
      }
    } catch (error) {
      console.error('Error loading items:', error);
      showNotification('Failed to load items', true);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]); // Include searchQuery in dependencies

  // Add useFocusEffect to reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      //console.log("focus in on screen page ")
      loadItems();
    }, [loadItems])
  );

  const showNotification = (message: string, isError: boolean = false) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(isError ? 'Error' : 'Success', message);
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

    setFilteredItems(partialMatches);
    setShowNewItemCard(true);
  }, [items]);

  const handleDeleteItem = async (itemId: string) => {
    try {
      await DatabaseService.items.delete(itemId);
      showNotification('Item deleted successfully');
      loadItems(); // Reload items after deletion
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('Failed to delete item', true);
    }
  };

  // Rest of the component remains the same...
  // (Keep all other existing code, just ensure loadItems is called when needed)

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
        imagePath: item.imagePath // Use imagePath instead of image
      });
    } catch (error) {
      console.error('Error adding item to shop list:', error);
      showNotification('Failed to add item to shop list', true);
    }
  };

  const handleAddNewItem = async (item: ItemCardProps) => {
    try {
      const newItemData = {
        name: item.name,
        quantity: item.quantity,
        quantityType: item.quantityType,
        imagePath: item.imagePath
        
      };
      //console.log('Adding to shop list with image:', item.imagePath);
      const newItem = await DatabaseService.items.create(newItemData);
      setItems(prevItems => [...prevItems, newItem]);
      setFilteredItems(prevItems => [...prevItems, newItem]);
      setShowNewItemCard(false);

      //await handleAddToShopList(item);
    } catch (error) {
      console.error('Error adding new item:', error);
      showNotification('Failed to create new item', true);
    }
  };

  const handleItemPress = (item: DatabaseItem) => {
    router.push(`/Home/ItemView?id=${item.id}`);
  };

  const renderItem = useCallback(({ item }: { item: DatabaseItem }) => (
    <ItemCard 
      item={{
        id: item.id,  // No need to parse as number anymore
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