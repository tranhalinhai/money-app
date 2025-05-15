// DetailTransactionHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DetailTransactionHeader = ({ onClose, onRemove }) => {
  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: wp('5%'),
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="arrow-back" marginLeft={wp('3%')} size={wp('7%')} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Detail Transaction</Text>
      <TouchableOpacity onPress={onRemove}>
        <Ionicons name="trash-outline" marginRight={wp('3%')} size={wp('7%')} color="#5E6368" />
      </TouchableOpacity>
    </View>
  );
};

export default DetailTransactionHeader;