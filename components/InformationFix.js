import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CameraPicker from './ImagePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const InformationFix = ({ }) => {
    const navigation = useNavigation();
    const route = useRoute();

    const [userName, setUserName] = useState('User Name');
    const [gmail, setGmail] = useState('username@gmail.com');
    const [selectedImage, setSelectedImage] = useState(null);
     const [imageUrl, setImageUrl] = useState(null); // new state

    useEffect(() => {
        if (route.params?.userData) {
            const { userName, gmail, selectedImage } = route.params.userData;
            setUserName(userName);
            setGmail(gmail);
            setSelectedImage(selectedImage);
           setImageUrl(selectedImage) // set image URL
        }
    }, [route.params?.userData]);

    const handleImagePick = (uri) => {
        setSelectedImage(uri);
        setImageUrl(uri); // set image url when pick image
    };
    const handleSave = async () => {
        // Get token
        const token = await AsyncStorage.getItem('userToken');
           try {
              const response = await fetch('http://172.20.10.2:5000/auth/update-me', {
                  method: 'PUT',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  },
                   body: JSON.stringify({ full_name: userName, image_url: imageUrl }), // send image_url too
              });
              if (!response.ok) {
                 const message = await response.text();
                 throw new Error(`HTTP error! status: ${response.status} message: ${message}`);
              }
               const data = await response.json();
             Alert.alert('Success', data.message);
               navigation.navigate('Profile', {
                userData: {
                    userName: data.user.full_name, // updated name
                    gmail: data.user.email, // updated email
                    selectedImage: data.user.image_url, // updated image
                },
            });
         } catch (error) {
               console.error("Error updating user", error);
               Alert.alert('Error', 'Failed to update user information')
             }
    };
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={wp('6%')} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Information</Text>
            </View>

            <View style={styles.editContainer}>
                <View style={styles.avatarContainer}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text>No image selected</Text>
                        </View>
                    )}
                    <CameraPicker onPickImage={handleImagePick} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={userName}
                        onChangeText={text => setUserName(text)}
                    />
                </View>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFEF6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: hp('2%'),
        top: hp('8%'),
    },
    backButton: {
        padding: wp('2%'),
    },
    headerTitle: {
        fontSize: hp('3%'),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        flex: 1,
    },
    editContainer: {
        padding: wp('5%'),
        marginTop: hp('5%'),
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: hp('3%'),
    },
    avatar: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: wp('5%'),
    },
    avatarPlaceholder: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: wp('5%'),
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',

    },
    inputContainer: {
        marginBottom: hp('2%'),
    },
    label: {
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
        marginBottom: hp('0.5%'),
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: wp('2%'),
        fontSize: hp('2%'),
        backgroundColor: 'white',
    },
    saveButton: {
        backgroundColor: '#FDD773',
        padding: hp('1.5%'),
        borderRadius: 8,
        alignItems: 'center',
        marginTop: hp('3%'),
    },
    saveButtonText: {
        color: 'black',
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
    },
});
export default InformationFix;