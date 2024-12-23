import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/app/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [listSortAsc, setListSortAsc] = useState(true);

  const handleClearData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your items and shopping lists. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace('/(tabs)/Home');
          }
        }
      ]
    );
  };

  const settingsOptions = [
    {
      icon: 'moon-outline',
      title: 'Dark Mode',
      type: 'switch',
      value: darkMode,
      onChange: setDarkMode
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      type: 'switch',
      value: notifications,
      onChange: setNotifications
    },
    {
      icon: 'swap-vertical-outline',
      title: 'Sort List Ascending',
      type: 'switch',
      value: listSortAsc,
      onChange: setListSortAsc
    },
    {
      icon: 'trash-outline',
      title: 'Clear All Data',
      type: 'button',
      onPress: handleClearData,
      color: Colors.error
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      type: 'link',
      //onPress: () => router.push('/Settings/about')
    }
  ];

  return (
    <View style={styles.container}>
      {settingsOptions.map((option, index) => (
        <TouchableOpacity
          key={option.title}
          style={[styles.option, index < settingsOptions.length - 1 && styles.borderBottom]}
          onPress={option.type === 'button' || option.type === 'link' ? option.onPress : undefined}
          disabled={option.type === 'switch'}
        >
          <View style={styles.optionContent}>
            <Ionicons 
              name={option.icon} 
              size={24} 
              color={option.color || Colors.darkGray} 
            />
            <Text style={[styles.optionText, option.color && { color: option.color }]}>
              {option.title}
            </Text>
          </View>

          {option.type === 'switch' && (
            <Switch
              value={option.value}
              onValueChange={option.onChange}
              trackColor={{ false: Colors.gray, true: Colors.primaryGreen }}
            />
          )}
          {option.type === 'link' && (
            <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.textPrimary,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  }
});