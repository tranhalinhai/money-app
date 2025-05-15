import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TransactionHeader = ({ selectedTime, onTimePress, onFilterPress, activeTab, onSortSelect }) => {
return (
        <View style={styles.filterContainer}>
            <TouchableOpacity onPress={onTimePress} style={styles.timeSelect}>
            <Text style={styles.timeText}>{selectedTime}</Text>
                <Ionicons name="chevron-down-outline" size={wp('5%')} color="black" style={styles.iconStyle}/>
            </TouchableOpacity>
            {onFilterPress && (
            <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
                <Ionicons name="filter-outline" size={wp('5%')} color="black" />
            </TouchableOpacity>
            )}
          {onSortSelect && (
            <TouchableOpacity onPress={() => onSortSelect('Highest')} style={styles.sortButton}>
             <Text style={styles.sortText}>Highest</Text>
            </TouchableOpacity>
         )}
         {onSortSelect && (
            <TouchableOpacity onPress={() => onSortSelect('Lowest')} style={styles.sortButton}>
                <Text style={styles.sortText}>Lowest</Text>
            </TouchableOpacity>
         )}
        </View>
);
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('90%'),
        },

    timeSelect: {
        flexDirection: 'row',
        width: wp('25%'),
        alignItems: 'center',
        padding: wp('2%'),
        borderRadius: wp('2%'),
        backgroundColor:'#FDD773',
        justifyContent: 'center',
    },

    timeText: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 0,
    },

    iconStyle: {
        marginLeft: wp('1%'),
    },

    filterButton:{
        marginLeft: wp('3%')
    },
    sortButton: {
         marginLeft: wp('2%')
     },
     sortText: {
         fontSize: wp('3.5%')
     }
});
    
export default TransactionHeader;