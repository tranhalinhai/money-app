import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import PopupRemoveSuccess from './PopupRemoveSuccess'; // Import the popup component
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmRemoveTransaction = ({ route, onClose }) => {
  const navigation = useNavigation(); // No type needed in JS
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(true);

  const handleCancel = () => {
    setShowConfirmDialog(false);
    onClose();
  };
 const transactionId = route.params?.transactionId;
 console.log("del id:",transactionId);
  const handleConfirm = async () => {
    setShowConfirmDialog(false);
   try {
        const token = await AsyncStorage.getItem('userToken');
         const response = await fetch(`http://172.20.10.2:5000/transactions/${transactionId}`, {
           method: 'DELETE',
           headers: {
             'Authorization': `Bearer ${token}`,
           },
         });
        console.log("delete:", response);
         if (!response.ok) {
           throw new Error('Failed to delete transaction');
         }

         // Hiển thị popup thành công
         setShowSuccessPopup(true);
         setTimeout(() => {
           setShowSuccessPopup(false);
           onClose(); // Gọi callback để xử lý sau khi xóa thành công
           navigation.goBack(); // Quay lại màn hình trước
         }, 1500);
       } catch (error) {
         Alert.alert('Error', 'Failed to delete transaction. Please try again.');
         console.error(error);
       }
     };

  const closePopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showConfirmDialog}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.iosModalContainer}>
            <Text style={styles.iosModalTitle}>Remove this transaction?</Text>
            <Text style={styles.iosModalMessage}>Are you sure you want to remove this transaction?</Text>
            <View style={styles.iosModalButtonContainer}>
              <TouchableOpacity style={styles.iosModalCancelButton} onPress={handleCancel}>
                <Text style={styles.iosModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iosModalConfirmButton} onPress={handleConfirm}>
                <Text style={styles.iosModalButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showSuccessPopup && <PopupRemoveSuccess onClose={closePopup} />}
    </>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  iosModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: wp('80%'),
    maxWidth: 300, // Limit maximum width
  },
  iosModalTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  iosModalMessage: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: 20,
  },
  iosModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iosModalCancelButton: {
    backgroundColor: '#d9d9d9', // Light gray
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginRight: 8, // Add some spacing
  },


  iosModalConfirmButton: {
    backgroundColor: '#FF3B30', // Red for destructive action
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,  // Add some spacing
  },

  iosModalButtonText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF'
  },
});


export default ConfirmRemoveTransaction;