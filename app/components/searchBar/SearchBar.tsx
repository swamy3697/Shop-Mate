// app/components/searchBar/SearchBar.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors,ColorOpacity } from '@/app/Colors';
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
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
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </TouchableOpacity>
        )}
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
    backgroundColor: Colors.white,
    borderRadius: 10,
    height: 50,
    marginHorizontal: 15,
    marginVertical: 10,
    borderColor:Colors.borderDark,
    borderWidth:0.5
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
  clearButton: {
    padding: 5,
  },
});

export default SearchBar;