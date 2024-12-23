
// components/EmptySearchResult/EmptySearchResult.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors,ColorOpacity } from '@/app/Colors';

interface EmptySearchResultProps {
  searchTerm: string;
}

const EmptySearchResult: React.FC<EmptySearchResultProps> = ({ searchTerm }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={50} color={Colors.gray} />
      <Text style={styles.title}>No items found</Text>
      <Text style={styles.subtitle}>
        No results found for "{searchTerm}".{'\n'}
        You can add it as a new item.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default EmptySearchResult;