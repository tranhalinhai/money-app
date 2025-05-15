// DetailTransaction.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DetailTransactionHeader from '../components/DetailTransaction/DetailTransactionHeader';
import TransactionInfo from '../components/DetailTransaction/TransactionInfo';
import TransactionDetails from '../components/DetailTransaction/TransactionDetails';
import TransactionTypeCategory from '../components/DetailTransaction/TransactionTypeCategory';
import ConfirmRemoveTransaction from '../components/ConfirmRemoveTransaction';
import EditTransaction from '../components/EditTransaction';
import LoadingIndicator from '../components/DetailTransaction/LoadingIndicator';
import NoTransactionFound from '../components/DetailTransaction/NoTransactionFound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/DetailTransactionStyles' ;


const DetailTransaction = ({ route, onClose }) => {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const transactionId = route.params?.transactionId;

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch(`http://172.20.10.2:5000/transactions/${transactionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error fetching transaction details:", errorData.message || response.status);
          onClose();
          return;
        }
        const data = await response.json();
        setTransactionDetails(data.transaction);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactionDetails();
  }, [transactionId]);

  const handleClose = () => {
    onClose();
  };

  const handleRemovePress = () => {
    setIsConfirmVisible(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmVisible(false);
    onClose();
  };

  const handleEditPress = () => {
    setIsEditVisible(true);
  };

  const handleEditClose = () => {
    setIsEditVisible(false);
  };

  const handleSaveEdit = (editedData) => {
    console.log('editedData:', editedData);
    setIsEditVisible(false);
  };


  return (
    <View style={styles.container}>
     <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {isLoading ? (
        <LoadingIndicator />
      ) : !transactionDetails ? (
        <NoTransactionFound />
      ) : (
        <>
          <DetailTransactionHeader onClose={handleClose} onRemove={handleRemovePress} />
          <TransactionInfo transaction={transactionDetails[0]} />
          <TransactionDetails transaction={transactionDetails[0]} onEditPress={handleEditPress} />
          <TransactionTypeCategory transaction={transactionDetails[0]} />

          <Modal visible={isConfirmVisible} animationType="slide" transparent={true}>
            <ConfirmRemoveTransaction
              route={{ params: { transactionId: transactionDetails[0].id } }}
              onClose={handleConfirmClose}
            />
          </Modal>

          <Modal visible={isEditVisible} animationType="slide" transparent={true}>
            <EditTransaction
              route={{ params: { ...transactionDetails[0], title: transactionDetails[0].name } }}
              onClose={handleEditClose}
              onSave={handleSaveEdit}
            />
          </Modal>
        </>
      )}
     </ScrollView>
    </View>
  );
};



export default DetailTransaction;