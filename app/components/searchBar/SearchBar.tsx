
// app/components/searchBar/SearchBar.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/app/Colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search items..."
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContent}>
        <TextInput
          style={styles.searchInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#888"
        />
        <View style={styles.divider} />
        <TouchableOpacity style={styles.iconContainer}>
          <Ionicons name="search" size={24} color={Colors.lightGreen} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    height: 50,
    marginHorizontal: 15,  // Changed from width: "100%" to use margins
    marginVertical: 10,
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

export default SearchBar;
