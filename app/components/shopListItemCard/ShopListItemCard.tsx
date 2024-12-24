import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, ColorOpacity } from '@/app/Colors';

interface ShopListItemCardProps {
  item: {
    id: string;
    name: string;
    imagePath: string;
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
  const defaultImage = require('../../assets/images/default.png');

  const getImageSource = () => {
    //console.log('ShopListItem received:', item.imagePath);
    if (!item.imagePath && !item.imagePath) return defaultImage;
    return { uri: item.imagePath|| item.imagePath };
  };

  //console.log(item.imagePath);

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
        source={getImageSource()}
        style={styles.image}
        defaultSource={defaultImage}
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
        <Ionicons name="trash-outline" size={20} color={Colors.error} />
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
    color: Colors.textOnPrimary,
    backgroundColor: Colors.selected,
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
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.textDisabled,
  },
  quantity: {
    fontSize: 13,
    color: Colors.info,
  },
  deleteButton: {
    padding: 8,
  },
});

export default ShopListItemCard;