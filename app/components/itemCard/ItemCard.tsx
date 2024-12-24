import React, { useState, memo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Modal, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/app/Colors';
import { ImageService } from '@/app/services/imageService';

const defaultImage = require('../../assets/images/default.png');
const QUANTITY_TYPES = ['Kg', 'Liters', 'Rupees', 'Packets', 'Pieces', 'Grams', 'Units', 'Dozens', 'Boxes'];

interface ItemCardProps {
  item: {
    id?: string;
    name: string;
    imagePath?: string;
    quantity: number;
    quantityType: string;
  };
  onAdd: (item: ItemCardProps['item']) => void;
  onDelete?: (id: string) => void;
  onPress?: () => void;
  isNewItem: boolean;
}

const ItemCard: React.FC<ItemCardProps> = memo(({ item, onAdd, onDelete, isNewItem = false }) => {
  const [quantity, setQuantity] = useState<number>(item.quantity || 1);
  const [quantityType, setQuantityType] = useState<string>(item.quantityType || 'Pieces');
  const [showModal, setShowModal] = useState(false);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(quantity.toString());
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(item.imagePath);
  const fadeAnim = new Animated.Value(1);

  const handleImagePress = () => {
    if (isNewItem) {
      setShowImageSourceModal(true);
    }
  };

  const handleImageSelect = async (useCamera: boolean) => {
    try {
      const permissions = await ImageService.requestPermissions();
      
      if (useCamera && !permissions.camera) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: ImageService.openSettings }
          ]
        );
        return;
      }
      
      if (!useCamera && !permissions.library) {
        Alert.alert(
          'Permission Required',
          'Photo library access is required to select images.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: ImageService.openSettings }
          ]
        );
        return;
      }

      const imageUri = await ImageService.pickImage(useCamera);
      if (imageUri) {
        const savedPath = await ImageService.saveImage(imageUri);
        setSelectedImage(savedPath);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setShowImageSourceModal(false);
    }
  };

  const getImageSource = () => {
    if (!selectedImage && !item.imagePath) return defaultImage;
    return { uri: selectedImage || item.imagePath };
  };

  const formatDecimal = (value: number): string => {
    return Number(value.toFixed(2)).toString();
  };

  const updateQuantity = (newValue: number) => {
    if (newValue >= 0.01 && newValue <= 99.99) {
      const formattedValue = Number(newValue.toFixed(2));
      setQuantity(formattedValue);
      setInputValue(formatDecimal(formattedValue));
    }
  };

  const handleQuantityChange = (text: string) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setInputValue(text);
      const num = parseFloat(text);
      if (!isNaN(num) && num >= 0.01 && num <= 1000) {
        setQuantity(num);
      }
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const num = parseFloat(inputValue);
    if (isNaN(num) || num < 0.01 || num > 99.99) {
      setInputValue(formatDecimal(quantity));
    } else {
      const formattedNum = Number(num.toFixed(2));
      setQuantity(formattedNum);
      setInputValue(formatDecimal(formattedNum));
    }
  };

  const handleIncrement = () => {
    const newValue = quantity + (quantity < 1 ? 0.1 : 1);
    updateQuantity(newValue);
  };

  const handleDecrement = () => {
    const newValue = quantity - (quantity <= 1 ? 0.1 : 1);
    updateQuantity(newValue);
  };

  const handleAdd = () => {
    //console.log('Selected image before adding:', selectedImage);
    setIsAdded(true);
    onAdd({ ...item, quantity, quantityType, imagePath: selectedImage });
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
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource()}
          style={styles.image}
          defaultSource={defaultImage}
        />
        {isNewItem && (
          <TouchableOpacity 
            onPress={handleImagePress}
            style={styles.imageOverlay}
          >
            <Ionicons name="camera" size={20} color={Colors.white} />
          </TouchableOpacity>
        )}
      </View>

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
                  keyboardType="decimal-pad"
                  maxLength={5}
                  autoFocus
                  onBlur={handleInputBlur}
                  onSubmitEditing={handleInputBlur}
                />
              ) : (
                <Text style={styles.quantityText}>{formatDecimal(quantity)}</Text>
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
  
      {/* Image Source Selection Modal */}
      <Modal
        visible={showImageSourceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageSourceModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageSourceModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => handleImageSelect(true)}
            >
              <Ionicons name="camera" size={24} color={Colors.primaryGreen} />
              <Text style={styles.modalItemText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => handleImageSelect(false)}
            >
              <Ionicons name="images" size={24} color={Colors.primaryGreen} />
              <Text style={styles.modalItemText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
  
      {/* Quantity Type Selection Modal */}
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
    backgroundColor: Colors.forestGreen,
    width: 28,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  quantityInputContainer: {
    width: 48,
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
    color: Colors.primaryGreen,
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
  modalItemSelected: {
    backgroundColor: Colors.lightGray,
  },
  modalItemTextSelected: {
    color: Colors.primaryGreen,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    marginRight: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primaryGreen,
    borderRadius: 12,
    padding: 4,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: Colors.black,
  },
});

export default ItemCard;