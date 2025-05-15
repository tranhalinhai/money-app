import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, CommonActions } from '@react-navigation/native';

const LogoutButton = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          onPress: () => {
            // Reset all navigation state
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  { name: 'SplashScreen' }
                ],
              })
            );

          }
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.listButton}>
      <Ionicons name="log-out" size={wp('8%')} color="#2B4D59" />
      <Text style={styles.buttonText}>Log-out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('5%'),
    marginVertical: hp('1%'),
    elevation: 2,
  },
  buttonText: {
    fontSize: hp('2%'),
    marginLeft: wp('4%'),
    color: '#000',
  },
});

export default LogoutButton;