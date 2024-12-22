// app/services/imageService.ts
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const ImageService = {
  // Request permissions
  requestPermissions: async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      return {
        camera: cameraStatus === 'granted',
        library: libraryStatus === 'granted',
      };
    }
    return { camera: false, library: false };
  },

  // Save image to local storage
  saveImage: async (uri: string): Promise<string> => {
    const filename = `${Date.now()}.jpg`;
    const directory = `${FileSystem.documentDirectory}images/`;
    const path = `${directory}${filename}`;

    try {
      // Create directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      // Copy image to app's local storage
      await FileSystem.copyAsync({
        from: uri,
        to: path,
      });

      return path;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  },

  // Pick image from camera or library
  pickImage: async (useCamera: boolean = false): Promise<string | null> => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      const result = useCamera 
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  },

  // Delete image from local storage
  deleteImage: async (path: string): Promise<void> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(path);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(path);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },
};