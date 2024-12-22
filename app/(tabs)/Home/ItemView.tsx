// app/(tabs)/Home/ItemView.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/app/Colors';
import { DatabaseService } from '@/app/services/databaseService';
import { ImageService } from '@/app/services/imageService';
import { Item } from '@/app/models/schema';

export default function ItemView() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<Item | null>(null);
  const defaultImage = 'https://via.placeholder.com/100';

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      const items = await DatabaseService.items.getAll();
      const foundItem = items.find(i => i.id === id);
      if (foundItem) {
        setItem(foundItem);
      }
    } catch (error) {
      console.error('Error loading item:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const permissions = await ImageService.requestPermissions();
      if (!permissions.library) {
        Alert.alert('Permission required', 'Please enable photo library access to change the image.');
        return;
      }

      const imageUri = await ImageService.pickImage(false);
      if (imageUri && item) {
        // Delete old image if exists
        if (item.imagePath) {
          await ImageService.deleteImage(item.imagePath);
        }

        // Save new image
        const savedPath = await ImageService.saveImage(imageUri);
        
        // Update item in database
        const items = await DatabaseService.items.getAll();
        const updatedItems = items.map(i => {
          if (i.id === item.id) {
            return { ...i, imagePath: savedPath };
          }
          return i;
        });
        await DatabaseService.items.save(updatedItems);
        
        // Update state
        setItem({ ...item, imagePath: savedPath });
      }
    } catch (error) {
      console.error('Error updating image:', error);
      Alert.alert('Error', 'Failed to update image');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
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
              if (item?.id) {
                await DatabaseService.items.delete(item.id);
                if (item.imagePath) {
                  await ImageService.deleteImage(item.imagePath);
                }
                router.back();
              }
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={handleImagePick}
      >
        <Image
          source={{ uri: item.imagePath || defaultImage }}
          style={styles.image}
        />
        <View style={styles.imageOverlay}>
          <Ionicons name="camera" size={24} color={Colors.white} />
          <Text style={styles.imageText}>Change Image</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.name}>{item.name}</Text>

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={20} color={Colors.white} />
        <Text style={styles.deleteButtonText}>Delete Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.white,
      padding: 20,
      alignItems: 'center',
    },
    imageContainer: {
      width: 200,
      height: 200,
      borderRadius: 100,
      marginBottom: 20,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: Colors.lightGray,
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
      fontSize: 16,
      fontWeight: '600',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: Colors.black,
      textAlign: 'center',
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.ratingYellow,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginTop: 'auto',
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,  // Adds shadow for Android
    },
    deleteButtonText: {
      color: Colors.white,
      marginLeft: 10,
      fontSize: 16,
      fontWeight: '600',
    },
  });
  