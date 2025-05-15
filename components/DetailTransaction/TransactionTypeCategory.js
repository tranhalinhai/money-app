import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TransactionTypeCategory = ({ transaction }) => {

  const styles = StyleSheet.create({
    typeTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: hp('23%'),
        gap: wp('1%'),
        width: wp('70%'),
        alignSelf: 'center',
        position: 'absolute',
    },
    typeButton: {
        flex: 1,
        backgroundColor: '#45ADA8',
        paddingVertical: hp('1.5%'),
        alignItems: 'center',
        borderRadius: wp('3%'),
    },
    titleButton: {
        flex: 1,
        backgroundColor: '#45ADA8',
        paddingVertical: hp('1.5%'),
        alignItems: 'center',
        borderRadius: wp('3%'),
    },
    typeText: {
        fontSize: wp('3.5%'),
        color: '#fff',
        fontWeight: 'bold',
    },
    typeValue: {
        fontSize: wp('4%'),
        color: '#fff',
        fontWeight: 'normal',
    },
    titleText: {
        fontSize: wp('3.5%'),
        color: '#fff',
        fontWeight: 'bold',
    },
    titleValue: {
        fontSize: wp('4%'),
        color: '#fff',
        fontWeight: 'normal',
    },

  });


  return (
    <View style={styles.typeTitleContainer}>
      <View style={styles.typeButton}>
        <Text style={styles.typeText}>Type</Text>
        <Text style={styles.typeValue}>{transaction.type}</Text>
      </View>
      <View style={styles.titleButton}>
        <Text style={styles.titleText}>Category</Text>
        <Text style={styles.titleValue}>{transaction.name}</Text>
      </View>
    </View>
  );
};

export default TransactionTypeCategory;