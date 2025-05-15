import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TransactionInfo = ({ transaction }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };


  const styles = StyleSheet.create({
    amount: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
    marginTop: hp('2%'),
    textAlign: 'center',
    },
    subtitle: {
    fontSize: wp('5%'),
    marginTop: hp('0.5%'),
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    },
    date: {
    fontSize: wp('3.5%'),
    color: '#5E6368',
    marginTop: hp('0.5%'),
    textAlign: 'center',
    },
  });

  return (
    <View>
      <Text style={styles.amount}>{transaction.amount} VND</Text>
      <Text style={styles.subtitle}>{transaction.note}</Text>
      <Text style={styles.date}>{formatDate(transaction.date)}</Text>
    </View>
  );
};


export default TransactionInfo;
