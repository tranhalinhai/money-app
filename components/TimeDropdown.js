import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TimeDropdown = ({ isVisible, onTimeSelect }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.timeDropdown}>
      <TouchableOpacity onPress={() => onTimeSelect('Day')} style={styles.timeItem}>
        <Text>Day</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTimeSelect('Week')} style={styles.timeItem}>
        <Text>Week</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onTimeSelect('Month')} style={styles.timeItem}>
        <Text>Month</Text>
      </TouchableOpacity>
        <TouchableOpacity onPress={() => onTimeSelect('Year')} style={styles.timeItem}>
        <Text>Year</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  timeDropdown: {
    position: 'absolute',
    top: hp('6%'),
    width: wp('25%'),
    backgroundColor: 'white',
    borderRadius: wp('1%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 2,
    alignItems: 'center',
  },
  timeItem: {
    padding: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default TimeDropdown;