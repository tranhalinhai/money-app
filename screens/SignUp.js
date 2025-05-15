import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignUp = () => {
  const navigation = useNavigation();
  const [full_name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
const [isLoading, setIsLoading] = useState(false);
    // Validate email using regex
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateFields = () => {
        if (!full_name || !email || !password) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return false;
        }
          if(!isValidEmail(email)) {
               Alert.alert('Lỗi', 'Email không đúng định dạng');
               return false;
          }

        if (password.length < 8) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự.');
            return false;
        }
        return true;
    };

    const handleSignup = async () => {
          if(!validateFields()){
             return;
           }
        setIsLoading(true);
         try {
           const response = await fetch('http://192.168.0.191:5000/auth/signup', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
           body: JSON.stringify({ email, password, full_name }),
        });
        const data = await response.json();
            if (response.ok) {
              console.log('Signup successfully:', data);
              navigation.navigate('Login');
            } else {
              Alert.alert("Signup Error", data.message);
            }
        } catch (error) {
          console.log(error)
           Alert.alert("Signup Error", "An error occurred during signup.");
        } finally {
          setIsLoading(false);
        }
    };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back"  size={25} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        Create an account to manage your finances, set budgets, and track spending limits efficiently.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Input Text"
          value={full_name}
          onChangeText={setName}
        />
      </View>

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

      <Text style={styles.terms}>
        By continuing, you agree to the Moneki Terms & Conditions and Privacy Policy
      </Text>


      <TouchableOpacity style={styles.continueButton} onPress={handleSignup}>
        <Text style={styles.continueButtonText}>Continue</Text>
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
    top: hp('10%'),
  },
  inputContainer: {
    marginBottom: hp('2%'),
    top: hp('10%'),
  },
  inputLabel: {
    fontSize: hp('2%'),
    color: '#000',
    marginBottom: hp('0.5%'),
  },
  required: {
    color: 'red',
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
    marginTop: hp('25%'),
    marginBottom: hp('3%'),
  },
  continueButton: {
    backgroundColor: '#F6C744',
    padding: hp('2%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('-1%'),
  },
  continueButtonText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#000',
  },
});

export default SignUp;
