import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoTransactionFound = () => {
  const styles = StyleSheet.create({
    noTransactionContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noTransactionText: {  // Added styling for the text
      fontSize: 16,       // Adjust font size as needed
      color: 'gray',     // Adjust color as needed
    },
  });

  return (
    <View style={styles.noTransactionContainer}>
      <Text style={styles.noTransactionText}>Không tìm thấy giao dịch.</Text>
    </View>
  );
};

export default NoTransactionFound;