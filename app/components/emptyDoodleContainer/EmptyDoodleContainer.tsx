import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '@/app/Colors';

// Importing the type for Ionicons icon names
type IoniconsName = keyof typeof Ionicons.glyphMap;

type EmptyDoodleContainerProps = {
    iconName: IoniconsName; // Ensures the name is strictly typed
    iconSize?: number;
    iconColor?: string;
    title: string;
    subtitle: string;
};

function EmptyDoodleContainer({
    iconName,
    iconSize = 100,
    iconColor = Colors.forestGreen,
    title,
    subtitle,
}: EmptyDoodleContainerProps) {
    return (
        <View style={styles.container}>
            <Ionicons 
                name={iconName} 
                size={iconSize} 
                color={iconColor}
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.darkGray,
        marginTop: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.gray,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default EmptyDoodleContainer;
