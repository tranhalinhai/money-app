import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

      // Validate email using regex
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const validateFields = () => {
        if (!email || !password) {
            return 'Vui lòng điền đầy đủ thông tin.';
        }
        if (!isValidEmail(email)) {
            return 'Email không đúng định dạng';
        }
        if (password.length < 8) {
            return 'Mật khẩu phải có ít nhất 8 ký tự.';
        }
        return null; // Return null if no errors
    };


    const handleLogin = async () => {
      const validationMessage = validateFields();
      if(validationMessage){
        Alert.alert('Lỗi', validationMessage);
        return;
      }
         setIsLoading(true);
        try {
            const response = await fetch('http://172.20.10.2:5000/auth/login', { // Thay địa chỉ IP nếu backend không ở máy local
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email:email.trim(), password:password.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successfully:', data);
                // Lưu token vào storage
                await AsyncStorage.setItem('userToken', data.token);
                console.log('Token được lưu:', data.token);
                // Chuyển hướng người dùng đến trang chủ.
                navigation.navigate('Homepage');

            } else {
                 console.log('Login unsuccessfully:', data);
                Alert.alert("Login Error", data.message);
            }
        } catch (error) {
           console.log(error)
          Alert.alert("Login Error", "An error occurred during login.");
        } finally{
          setIsLoading(false);
        }
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back"  size={25} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Log In</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Input Text"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Input Text"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.passwordHint}>Passwords must be a minimum of 8 characters.</Text>
      </View>
      <Text style={styles.loginText}>

                <Text style={styles.donthaveAcc}>Don’t have an account? </Text>
                <Text style={styles.loginLink} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
        </Text>

        {isLoading ? <ActivityIndicator size="large" color="#F6C744" style={{ marginTop: 20 }} /> : null}
      <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
        <Text style={styles.continueButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF6',
    padding: wp('5%'),
  },
  backButton: {
    marginBottom: hp('2%'),
    top: hp('9%'),
  },
  backArrow: {
    fontSize: wp('6%'),
    color: '#000',
  },
  title: {
    fontSize: hp('4%'),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: hp('1%'),
    top: hp('10%'),
  },
  subtitle: {
    fontSize: hp('2%'),
    color: '#666',
    marginBottom: hp('2%'),
    top: hp('14%'),
  },
  inputContainer: {
    marginBottom: hp('2%'),
    top: hp('12%'),
  },
  inputLabel: {
    fontSize: hp('2%'),
    color: '#000',
    marginBottom: hp('0.5%'),
  },
  required: {
    color: 'red',
  },
  forgotPass: {
    fontSize: hp('2%'),
    color: '#4CA999',
    fontWeight: 'bold',
  },
  donthaveAcc: {
    textAlign: 'left',
    fontSize: hp('2%'),
    color: '#666',
    marginBottom: hp('3%'),
    top: hp('10%'),
    lineHeight: hp('3%'),
  },
  loginText: {
    textAlign: 'left',
    fontSize: hp('2%'),
    color: '#666',
    marginBottom: hp('3%'),
    top: hp('12%'),
  },
  loginLink: {
    fontSize: hp('2%'),
    color: '#4CA999',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    fontSize: hp('2%'),
    backgroundColor: '#FFFEF6',
  },
  passwordHint: {
    fontSize: hp('1.5%'),
    color: '#999',
    marginTop: hp('0.5%'),
  },
  terms: {
    fontSize: hp('2%'),
    color: '#666',
    textAlign: 'center',
    marginTop: hp('4%'),
    marginBottom: hp('3%'),
    top: hp('35%'),
  },
  continueButton: {
    backgroundColor: '#F6C744',
    padding: hp('2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('43%'),
  },
  continueButtonText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Login;