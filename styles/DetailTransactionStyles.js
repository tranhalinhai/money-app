import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
        container: {
        flex: 1,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: hp('5%'),
        backgroundColor: '#F4F4F4',
        width: '100%',
        height: '100%',
        },
        scrollViewContent: {
          flexGrow: 1, // Important for scrolling to work correctly
           // Add bottom padding to prevent content from being cut off
        },
});

export default styles;