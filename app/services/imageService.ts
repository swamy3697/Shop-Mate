import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Linking from 'expo-linking';
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

  // Open device settings
  openSettings: async () => {
    if (Platform.OS === 'ios') {
      await Linking.openURL('app-settings:');
    } else {
      await Linking.openSettings();
    }
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
        // it is modified by me from mediaTypes: ImagePicker.MediaTypeOptions.Images,
        mediaTypes: ['images'],
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

  // Check if image exists
  checkImageExists: async (path: string): Promise<boolean> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(path);
      return fileInfo.exists;
    } catch (error) {
      console.error('Error checking image:', error);
      return false;
    }
  }
};