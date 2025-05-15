// TransactionDetails.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const TransactionDetails = ({ transaction, onEditPress }) => {
  const styles = StyleSheet.create({

darkBGcontainer: {
backgroundColor: '#2B4D59',
borderTopLeftRadius: wp('10%'),
borderTopRightRadius: wp('10%'),
marginTop: hp('8%'),
marginBottom: 0,
paddingTop: hp('4%'),
},

descriptionContainer: {
marginTop: hp('2%'),
backgroundColor: '#2B4D59',
padding: wp('4%'),
borderRadius: wp('2%'),
marginLeft: wp('3%'),
marginRight: wp('3%'),
},
descriptionLabel: {
fontSize: wp('4.5%'),
fontWeight: 'bold',
color: '#fff',
marginBottom: hp('1%'),
},
descriptionText: {
fontSize: wp('3.5%'),
color: '#fff',
},
notesContainer: {
marginTop: hp('2%'),
backgroundColor: '#2B4D59',
padding: wp('4%'),
borderRadius: wp('2%'),
gap: hp('1%'),
marginLeft: wp('3%'),
marginRight: wp('3%'),
},

notesLabel: {
fontSize: wp('4.5%'),
fontWeight: 'bold',
color: '#fff',
},
notesImage: {
width: '100%',
height: hp('25%'),
},
editButton: {
backgroundColor: '#FDD773',
paddingVertical: hp('2%'),
marginHorizontal: wp('3%'),
alignItems: 'center',
borderRadius: wp('1.5%'),
marginTop: hp('3%'),
marginBottom: hp('8%'),
},
editText: {
fontSize: wp('5%'),
color: '#000',
fontWeight: 'bold',
}

  });


  return (
    <View style={styles.darkBGcontainer}>
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionLabel}>Description</Text>
        <Text style={styles.descriptionText}>{transaction.note}</Text>
      </View>

      <View style={styles.notesContainer}>
        <Text style={styles.notesLabel}>Image</Text>
        <Image source={{ uri: transaction.image_url }} style={styles.notesImage} resizeMode="contain" />
      </View>
      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
};


export default TransactionDetails;