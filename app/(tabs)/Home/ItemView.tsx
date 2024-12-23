import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors,ColorOpacity } from '@/app/Colors';
import { DatabaseService } from '@/app/services/databaseService';
import { ImageService } from '@/app/services/imageService';
import { Item } from '@/app/models/schema';

// Define type for route params
type ItemViewParams = {
  id: string;
};

export default function ItemView() {
  const { id } = useLocalSearchParams<ItemViewParams>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultImage = 'https://via.placeholder.com/100';

  useEffect(() => {
    if (!id) {
      setError('Invalid item ID');
      setIsLoading(false);
      return;
    }
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const items = await DatabaseService.items.getAll();
      const foundItem = items.find(i => i.id === id);
      
      if (!foundItem) {
        setError('Item not found');
        return;
      }
      
      setItem(foundItem);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(`Error loading item: ${errorMessage}`);
      console.error('Error loading item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePick = async () => {
    if (!item?.id) return;

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

      // Delete old image if exists
      if (item.imagePath) {
        await ImageService.deleteImage(item.imagePath);
      }

      // Save new image
      const savedPath = await ImageService.saveImage(imageUri);
      
      // Update item in database
      const updatedItem = { ...item, imagePath: savedPath };
      const items = await DatabaseService.items.getAll();
      const updatedItems = items.map(i => i.id === item.id ? updatedItem : i);
      await DatabaseService.items.save(updatedItems);
      
      setItem(updatedItem);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error updating image:', error);
      Alert.alert('Error', `Failed to update image: ${errorMessage}`);
    }
  };

  const handleDelete = async () => {
    if (!item?.id) return;

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
              await DatabaseService.items.delete(item.id);
              if (item.imagePath) {
                await ImageService.deleteImage(item.imagePath);
              }
              router.back();
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

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.ratingYellow} />
        <Text style={styles.loadingText}>Loading item...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.ratingYellow} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadItem}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.imageContainer}
        onPress={handleImagePick}
        activeOpacity={0.8}
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
        activeOpacity={0.7}
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
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
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
    backgroundColor: Colors.error,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 'auto',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  deleteButtonText: {
    color: Colors.white,
    marginLeft: 10,
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
  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.ratingYellow,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});