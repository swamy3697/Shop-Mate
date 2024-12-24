import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Share, Platform, Linking } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Colors } from '@/app/Colors';
import * as Clipboard from 'expo-clipboard';
import { ShopListItem } from '@/app/models/schema';

interface ShareOptionsProps {
  shopList: ShopListItem[];
}

const ShareButton: React.FC<ShareOptionsProps> = ({ shopList }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Memoize formatted text
  const formattedText = useMemo(() => 
    shopList.map(item => `${item.name} ${item.quantity} ${item.quantityType}`).join('\n'),
    [shopList]
  );

  const closeModals = useCallback(() => {
    setModalVisible(false);
    setShowShareOptions(false);
  }, []);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    await Clipboard.setStringAsync(formattedText);
    closeModals();
  }, [formattedText, closeModals]);

  // Share via WhatsApp
  const shareViaWhatsApp = useCallback(async () => {
    try {
      const encodedText = encodeURIComponent(formattedText);
      const url = `whatsapp://send?text=${encodedText}`;
      
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback to regular share if WhatsApp isn't installed
        await Share.share({
          message: formattedText,
          title: 'Shopping List', // iOS only
        });
      }
    } catch (error) {
      // Fallback to regular share if anything goes wrong
      await Share.share({
        message: formattedText,
        title: 'Shopping List', // iOS only
      });
    }
    closeModals();
  }, [formattedText, closeModals]);

  // Share as text using platform-specific sharing
  const shareAsText = useCallback(async () => {
    try {
      await Share.share({
        message: formattedText,
        title: 'Shopping List', // iOS only
      }, {
        // iOS specific options
        subject: 'Shopping List',
        excludedActivityTypes: [
          'com.apple.UIKit.activity.Print',
          'com.apple.UIKit.activity.SaveToCameraRoll',
        ],
        // Dialog title on iOS
        dialogTitle: 'Share Shopping List',
      });
      closeModals();
    } catch (error) {
      console.error('Error sharing text:', error);
    }
  }, [formattedText, closeModals]);

  // Generate HTML for PDF
  const htmlContent = useMemo(() => {
    const items = shopList
      .map((item, index) => 
        `<tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.quantity} ${item.quantityType}</td>
        </tr>`
      )
      .join('');

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: '-apple-system', 'Roboto', sans-serif; padding: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Shopping List</h1>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Item</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>${items}</tbody>
          </table>
        </body>
      </html>
    `;
  }, [shopList]);

  // Share as PDF
  const shareAsPDF = useCallback(async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });

      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri, {
          UTI: 'com.adobe.pdf',
          mimeType: 'application/pdf'
        });
      } else {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Shopping List'
        });
      }
    } catch (error) {
      console.error('Error creating/sharing PDF:', error);
    }
    closeModals();
  }, [htmlContent, closeModals]);

  return (
    <>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="share-social" size={24} color={Colors.white} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModals}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={shareAsText}
            >
              <Text style={styles.modalOptionText}>Share as Text</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalOption}
              onPress={shareAsPDF}
            >
              <Text style={styles.modalOptionText}>Share as PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalOption, styles.cancelButton]}
              onPress={closeModals}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showShareOptions}
        onRequestClose={closeModals}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={shareViaWhatsApp}
            >
              <Text style={styles.modalOptionText}>Share via WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={copyToClipboard}
            >
              <Text style={styles.modalOptionText}>Copy to Clipboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalOption, styles.cancelButton]}
              onPress={closeModals}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: Colors.primaryGreen,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 10,
    borderBottomWidth: 0,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default React.memo(ShareButton);