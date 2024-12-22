// app/components/shopListItemCard/ShopListItemCard.tsx
import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/app/Colors';

interface ShopListItemCardProps {
  item: {
    id: string;
    name: string;
    image?: string;
    quantity: number;
    quantityType: string;
    completed: boolean;
  };
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const ShopListItemCard: React.FC<ShopListItemCardProps> = memo(({ 
  item, 
  onToggleComplete,
  onDelete 
}) => {
  const defaultImage = 'https://via.placeholder.com/100';

  return (
    <View style={[styles.container, item.completed && styles.completedContainer]}>
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={() => onToggleComplete(item.id)}
      >
        <Ionicons 
          name={item.completed ? "checkbox" : "square-outline"} 
          size={24} 
          color={Colors.primaryGreen}
        />
      </TouchableOpacity>

      <Image
        source={{ uri: item.image || defaultImage }}
        style={styles.image}
      />
      
      <View style={styles.details}>
        <Text style={[styles.name, item.completed && styles.completedText]}>
          {item.name}
        </Text>
        <Text style={styles.quantity}>
          {item.quantity} {item.quantityType}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={Colors.gray} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 15,
    marginVertical: 4,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    opacity: 0.7,
    color:Colors.white,
    
    backgroundColor: Colors.primaryGreen,
  },
  checkbox: {
    marginRight: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.gray,
  },
  quantity: {
    fontSize: 13,
    color: Colors.darkGray,
  },
  deleteButton: {
    padding: 8,
  },
});

export default ShopListItemCard;