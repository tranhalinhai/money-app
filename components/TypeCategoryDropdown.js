import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TypeCategoryDropdown = ({ isVisible, onTypeSelect, style}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={[styles.typeCategoryDropdown, style]}>
      <TouchableOpacity onPress={() => onTypeSelect('expense')} style={styles.typeItem}>
        <Text style={{ fontSize: hp('2%') }}>Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTypeSelect('income')} style={styles.typeItem}>
        <Text style={{ fontSize: hp('2%') }}>Income</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  typeCategoryDropdown: {
    backgroundColor: 'white',
    borderRadius: wp('1%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Improved shadow
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,      // For Android shadow
  },

  typeItem: {
    padding: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',

  },
});

export default TypeCategoryDropdown;