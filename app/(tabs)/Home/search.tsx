// app/(tabs)/Home/search.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import SearchBar from '@/app/components/searchBar';
import ItemCard from '@/app/components/itemCard';
import EmptySearchResult from '@/app/components/EmptySearchResults';
import Colors from '@/app/Colors';

interface Item {
  id: number;
  name: string;
  image?: string;
  quantity?: number;
  quantityType?: string;
}

// Dummy data
const dummyItems: Item[] = [
  {
    id: 1,
    name: 'Rice',
    image: 'https://via.placeholder.com/100',
    quantity: 1,
    quantityType: 'kg'
  },
  {
    id: 2,
    name: 'Milk',
    image: 'https://via.placeholder.com/100',
    quantity: 1,
    quantityType: 'liter'
  },
  {
    id: 3,
    name: 'Bread',
    image: 'https://via.placeholder.com/100',
    quantity: 1,
    quantityType: 'packet'
  },
  {
    id: 4,
    name: 'Eggs',
    image: 'https://via.placeholder.com/100',
    quantity: 12,
    quantityType: 'pieces'
  },
  {
    id: 5,
    name: 'ok',
    image: 'https://via.placeholder.com/100',
    quantity: 12,
    quantityType: 'pieces'
  }
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [items] = useState<Item[]>(dummyItems);
  const [filteredItems, setFilteredItems] = useState<Item[]>(dummyItems);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [items]);

  const renderItem = useCallback(({ item }: { item: Item }) => (
    <ItemCard 
      item={item} 
      onAdd={() => console.log('Adding item:', item)}
      isNewItem={false}
    />
  ), []);

  const getHeaderComponent = useCallback(() => {
    if (searchQuery.trim() !== '' && filteredItems.length === 0) {
      return (
        <View style={styles.headerContainer}>
          <ItemCard
            item={{
              id: -1,
              name: searchQuery,
              quantity: 1,
              quantityType: 'piece',
            }}
            onAdd={console.log}
            isNewItem={true}
          />
          <EmptySearchResult searchTerm={searchQuery} />
        </View>
      );
    }
    return null;
  }, [searchQuery, filteredItems.length]);

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search for items..."
      />

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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