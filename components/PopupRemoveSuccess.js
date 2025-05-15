import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onClose: () => void;
}

const PopupRemoveSuccess: React.FC<Props> = ({ onClose }) => {
  return (
    //<View style={styles.container}>
      <View style={styles.modalContent}>
        <Ionicons name="checkmark-circle" size={wp('10%')} color='#000' style={styles.icon} />
        <Text style={styles.message}>Transaction has been successfully removed</Text>
      </View>
    //</View>
  );
};


const styles = StyleSheet.create({
  modalContent: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: hp('30%'),
    backgroundColor: '#FFECBB',
    borderRadius: wp('5%'),
    padding: wp('8%'),
    alignItems: 'center',
    width: wp('80%'),
        gap: hp('2%'),
  },
  icon: {
        
    },
  message: {
    fontSize: wp('4%'),
    textAlign: 'center',
    color: '#000'
  },
});


export default PopupRemoveSuccess;