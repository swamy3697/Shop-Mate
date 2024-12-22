// app/components/itemCard/ItemCard.tsx
import React, { useState, memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/app/Colors';

interface ItemCardProps {
  item: {
    id?: number;
    name: string;
    image?: string;
    quantity?: number;
    quantityType?: string;
  };
  onAdd: (item: any) => void;
  onDelete?: (id: number) => void;
  isNewItem?: boolean;
}

const QUANTITY_TYPES = ['Kg', 'Liters', 'Rupees','Packets', 'Pieces', 'Grams', 'Units', 'Dozens', 'Boxes'];

const ItemCard: React.FC<ItemCardProps> = memo(({ item, onAdd, onDelete, isNewItem = false }) => {
  const defaultImage = 'https://via.placeholder.com/100';
  const [quantity, setQuantity] = useState<number>(item.quantity || 1);
  const [quantityType, setQuantityType] = useState<string>(item.quantityType || 'Pieces');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(quantity.toString());
  const [isAdded, setIsAdded] = useState(false);
  const fadeAnim = new Animated.Value(1);

  const updateQuantity = (newValue: number) => {
    if (newValue >= 1 && newValue <= 99) {
      setQuantity(newValue);
      setInputValue(newValue.toString());
    }
  };

  const handleQuantityChange = (text: string) => {
    setInputValue(text);
    const num = parseInt(text);
    if (!isNaN(num) && num >= 1 && num <= 25) {
      setQuantity(num);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const num = parseInt(inputValue);
    if (isNaN(num) || num < 1 || num > 25) {
      setInputValue(quantity.toString());
    } else {
      updateQuantity(num);
    }
  };

  const handleAdd = () => {
    setIsAdded(true);
    onAdd({ ...item, quantity, quantityType });
    
    // Animate the icon change
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleItemPress = () => {
    if (item.id) {
      router.push({
        pathname: '/Home/ItemView',
        params: { id: item.id }
      });
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleItemPress}
      style={[styles.container, { backgroundColor: Colors.lightGray }]}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image || defaultImage }}
        style={styles.image}
      />
      
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        
        <View style={styles.controlsRow}>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              onPress={() => updateQuantity(quantity - 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="remove" size={16} color={Colors.white} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setIsEditing(true)}
              style={styles.quantityInputContainer}
            >
              {isEditing ? (
                <TextInput
                  style={styles.quantityInput}
                  value={inputValue}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                  maxLength={2}
                  autoFocus
                  onBlur={handleInputBlur}
                  onSubmitEditing={handleInputBlur}
                />
              ) : (
                <Text style={styles.quantityText}>{quantity}</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => updateQuantity(quantity + 1)}
              style={styles.quantityButton}
            >
              <Ionicons name="add" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.typeSelector}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.typeText}>{quantityType}</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.darkGray} />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity 
          style={[styles.addButton, isNewItem && styles.newItemButton]}
          onPress={handleAdd}
        >
          <Ionicons 
            name={isAdded ? "checkmark-circle" : isNewItem ? "add-circle" : "cart"} 
            size={24} 
            color={Colors.white} 
          />
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            {QUANTITY_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.modalItem,
                  type === quantityType && styles.modalItemSelected
                ]}
                onPress={() => {
                  setQuantityType(type);
                  setShowModal(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  type === quantityType && styles.modalItemTextSelected
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 15,
    marginVertical: 4,
    alignItems: 'center',
    borderRadius: 12,
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
    marginBottom: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 6,
    height: 32,
  },
  quantityButton: {
    backgroundColor: Colors.primaryGreen,
    width: 28,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInputContainer: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    color: Colors.black,
    padding: 0,
  },
  quantityText: {
    fontSize: 14,
    color: Colors.black,
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    height: 32,
    borderRadius: 6,
    gap: 4,
  },
  typeText: {
    fontSize: 13,
    color: Colors.black,
  },
  addButton: {
    backgroundColor: Colors.primaryGreen,
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  newItemButton: {
    backgroundColor: Colors.linkBlue,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 8,
    width: '80%',
    maxHeight: '80%',
  },
  modalItem: {
    padding: 12,
    borderRadius: 6,
  },
  modalItemSelected: {
    backgroundColor: Colors.lightGray,
  },
  modalItemText: {
    fontSize: 14,
    color: Colors.black,
  },
  modalItemTextSelected: {
    color: Colors.primaryGreen,
    fontWeight: 'bold',
  },
});

export default ItemCard;