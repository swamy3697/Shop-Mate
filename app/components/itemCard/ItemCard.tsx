import React, { useState, memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  isNewItem?: boolean;
}

const QUANTITY_TYPES = ['Kg', 'Liters', 'Packets', 'Pieces', 'Grams', 'Units', 'Dozens', 'Boxes'];

const ItemCard: React.FC<ItemCardProps> = memo(({ item, onAdd, isNewItem = false }) => {
  const defaultImage = 'https://via.placeholder.com/100';
  const [quantity, setQuantity] = useState<number>(item.quantity || 1);
  const [quantityType, setQuantityType] = useState<string>(item.quantityType || 'Pieces');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(quantity.toString());

  const updateQuantity = (newValue: number) => {
    if (newValue >= 1 && newValue <= 25) {
      setQuantity(newValue);
      setInputValue(newValue.toString());
    }
  };

  const handleIncrement = () => {
    updateQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(quantity - 1);
  };

  const handleQuantityChange = (text: string) => {
    setInputValue(text); // Update the input value immediately for responsiveness
    const num = parseInt(text);
    if (!isNaN(num) && num >= 1 && num <= 25) {
      setQuantity(num);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    // When input loses focus, ensure the display value is valid
    const num = parseInt(inputValue);
    if (isNaN(num) || num < 1 || num > 25) {
      setInputValue(quantity.toString()); // Reset to last valid quantity
    } else {
      updateQuantity(num);
    }
  };

  const handleAdd = () => {
    onAdd({ ...item, quantity, quantityType });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.image || defaultImage }}
        style={styles.image}
      />
      
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        
        <View style={styles.controlsRow}>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              onPress={handleDecrement}
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
              onPress={handleIncrement}
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

      <TouchableOpacity 
        style={[styles.addButton, isNewItem && styles.newItemButton]}
        onPress={handleAdd}
      >
        <Ionicons 
          name={isNewItem ? "add-circle" : "add"} 
          size={24} 
          color={Colors.white}
        />
      </TouchableOpacity>

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
    </View>
  );
});
// ... styles remain the same ...
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
    backgroundColor: Colors.lightGray,
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
    backgroundColor: Colors.lightGray,
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