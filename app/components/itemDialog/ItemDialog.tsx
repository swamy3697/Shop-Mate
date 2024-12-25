import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/Colors';
import { DatabaseService } from '@/app/services/databaseService';
import { ImageService } from '@/app/services/imageService';

interface ItemDialogProps {
  visible: boolean;
  itemId: string | null;
  onClose: () => void;
  onItemUpdated: () => void;
}

interface FormData {
  name: string;
  quantity: string;
  quantityType: string;
  imagePath?: string;
}

const quantityTypes = ['Kg', 'Liters', 'Rupees', 'Packets', 'Pieces', 'Grams', 'Units', 'Dozens', 'Boxes'];

const ItemDialog = ({ visible, itemId, onClose, onItemUpdated }: ItemDialogProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultImage = 'https://via.placeholder.com/100';
  const [showQuantityTypeModal, setShowQuantityTypeModal] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    quantity: '1',
    quantityType: 'piece',
  });

  useEffect(() => {
    if (visible && itemId) {
      loadItem();
    }
  }, [visible, itemId]);

  useEffect(() => {
    if (!visible) {
      setShowQuantityTypeModal(false);
    }
  }, [visible]);

  const loadItem = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const items = await DatabaseService.items.getAll();
      const foundItem = items.find(i => i.id === itemId);
      
      if (!foundItem) {
        setError('Item not found');
        return;
      }
      
      setFormData({
        name: foundItem.name,
        quantity: String(foundItem.quantity),
        quantityType: foundItem.quantityType,
        imagePath: foundItem.imagePath,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(`Error loading item: ${errorMessage}`);
      console.error('Error loading item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePick = async () => {
    if (!itemId) return;

    try {
      const permissions = await ImageService.requestPermissions();
      if (!permissions.library) {
        Alert.alert(
          'Permission Required',
          'Please enable photo library access in your device settings to change the image.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: ImageService.openSettings }
          ]
        );
        return;
      }

      const imageUri = await ImageService.pickImage(false);
      if (!imageUri) return;

      if (formData.imagePath) {
        await ImageService.deleteImage(formData.imagePath);
      }

      const savedPath = await ImageService.saveImage(imageUri);
      setFormData(prev => ({ ...prev, imagePath: savedPath }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error updating image:', error);
      Alert.alert('Error', `Failed to update image: ${errorMessage}`);
    }
  };
  const updateItem = async (updatedData: FormData) => {
    if (!itemId) return;
    
    try {
      const items = await DatabaseService.items.getAll();
      const updatedItems = items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            name: updatedData.name,
            quantity: Number(updatedData.quantity),
            quantityType: updatedData.quantityType,
            imagePath: updatedData.imagePath,
          };
        }
        return item;
      });
      
      await DatabaseService.items.save(updatedItems);
      await onItemUpdated(); // Wait for this to complete
      onClose(); // Close dialog after update is complete
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item');
    }
  };
  const handleDelete = () => {
    if (!itemId) return;

    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await DatabaseService.items.delete(itemId);
              if (formData.imagePath) {
                await ImageService.deleteImage(formData.imagePath);
              }
              onClose();
              onItemUpdated();
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
              console.error('Error deleting item:', error);
              Alert.alert('Error', `Failed to delete item: ${errorMessage}`);
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }
  
    try {
      await updateItem(formData);
      // Remove onClose() from here since it's called in updateItem
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const QuantityTypeModal = () => (
    <Modal
      visible={showQuantityTypeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowQuantityTypeModal(false)}
      presentationStyle="overFullScreen"
    >
      <View style={[
        styles.modalOverlay,
        Platform.OS === 'ios' && styles.iosModalOverlay
      ]}>
        <View style={styles.quantityTypeModalContent}>
          <Text style={styles.modalTitle}>Select Quantity Type</Text>
          <ScrollView>
            {quantityTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeOption,
                  formData.quantityType === type && styles.selectedTypeOption
                ]}
                onPress={() => {
                  setFormData(prev => ({ ...prev, quantityType: type }));
                  setShowQuantityTypeModal(false);
                }}
              >
                <Text style={[
                  styles.typeOptionText,
                  formData.quantityType === type && styles.selectedTypeOptionText
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowQuantityTypeModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {isLoading ? (
                <View style={styles.centerContainer}>
                  <ActivityIndicator size="large" color={Colors.ratingYellow} />
                  <Text style={styles.loadingText}>Loading item...</Text>
                </View>
              ) : error ? (
                <View style={styles.centerContainer}>
                  <Ionicons name="alert-circle-outline" size={48} color={Colors.ratingYellow} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity 
                    style={styles.imageContainer}
                    onPress={handleImagePick}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: formData.imagePath || defaultImage }}
                      style={styles.image}
                    />
                    <View style={styles.imageOverlay}>
                      <Ionicons name="camera" size={24} color={Colors.white} />
                      <Text style={styles.imageText}>Change Image</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.formContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.name}
                      onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
                      placeholder="Item name"
                    />

                    <Text style={styles.label}>Default Quantity</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.quantity}
                      onChangeText={text => setFormData(prev => ({ ...prev, quantity: text }))}
                      keyboardType="numeric"
                      placeholder="Quantity"
                    />

                    <Text style={styles.label}>Quantity Type</Text>
                    <TouchableOpacity
                      style={styles.quantityTypeButton}
                      onPress={() => setShowQuantityTypeModal(true)}
                    >
                      <Text style={styles.quantityTypeButtonText}>
                        {formData.quantityType}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color={Colors.black} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={handleDelete}
                    >
                      <Ionicons name="trash-outline" size={20} color={Colors.white} />
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={onClose}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.saveButton}
                        onPress={handleSave}
                      >
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <QuantityTypeModal />
    </>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    maxHeight: '90%',
  },
  quantityTypeModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.lightGray,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: Colors.white,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  quantityTypeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  quantityTypeButtonText: {
    fontSize: 16,
    color: Colors.black,
  },
  typeOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  selectedTypeOption: {
    backgroundColor: Colors.lightGreen,
  },
  typeOptionText: {
    fontSize: 16,
    color: Colors.black,
  },
  selectedTypeOptionText: {
    color: Colors.white,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  deleteButtonText: {
    color: Colors.white,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  cancelButtonText: {
    color: Colors.black,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  saveButtonText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.black,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
  },

  iosModalOverlay: {
    justifyContent: 'flex-end', // Makes modal slide up from bottom on iOS
    margin: 0,
    padding: 0,
  },
});

export default ItemDialog;