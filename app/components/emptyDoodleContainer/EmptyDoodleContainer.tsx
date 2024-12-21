// app/components/emptyDoodleContainer/EmptyDoodleContainer.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Colors from '@/app/Colors';

function EmptyDoodleContainer() {
    return (
        <View style={styles.container}>
            <Ionicons 
                name="cart-outline" 
                size={100} 
                color={Colors.lightGreen}
            />
            <Text style={styles.title}>Your shopping list is empty</Text>
            <Text style={styles.subtitle}>
                Search and add items to your shopping list
            </Text>
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