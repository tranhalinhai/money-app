import React, { useState, useEffect } from 'react';
import { View, Modal, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LogoutButton from '../components/LogoutButton';
import Category from '../components/Category';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ onScreenChange }) => {
    const navigation = useNavigation();
    const route = useRoute();

    const [userName, setUserName] = useState('User Name');
    const [gmail, setGmail] = useState('username@gmail.com');
    const [selectedImage, setSelectedImage] = useState(null);
    const [showCategory, setShowCategory] = useState(false);

    useEffect(() => {
        if (onScreenChange) {
            onScreenChange('Profile'); // Truyền 'Budget' để kích hoạt biểu tượng
        }

        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                console.log("userToken in async storage:", token);
                if (token) {
                    console.log("Request sent to:  with token: ", token)
                    const response = await fetch('http://192.168.0.191:5000/auth/me', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        console.log("response object:", response);
                        const message = await response.text();
                        throw new Error(`HTTP error! status: ${response.status} message: ${message}`);
                    }
                    const data = await response.json();
                    const { user } = data;
                    setUserName(user.full_name || 'User Name');
                    setGmail(user.email || 'username@gmail.com');
                    setSelectedImage(user.image_url || null); // Set image URL from backend
                } else {
                    console.log("No token found")
                }

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();

        // Cập nhật data từ trang InformationFix
        if (route.params?.userData) {
            const { userName, gmail, selectedImage } = route.params.userData;
            setUserName(userName);
            setGmail(gmail);
            setSelectedImage(selectedImage);
        }
    }, [onScreenChange, route.params?.userData]);

    const handleEditProfile = () => {
        navigation.navigate('InformationFix', {
            userData: {
                userName: userName,
                gmail: gmail,
                selectedImage: selectedImage
            }
        });
    };

    const handleCategoryPress = () => {
        setShowCategory(true)
    }
    const handleCategoryClose = () => {
        setShowCategory(false)
    }


    return (
        <View style={styles.container}>
            <Modal visible={showCategory} transparent={true} animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} onPress={handleCategoryClose} activeOpacity={1}>
                    <View style={styles.modalContent}>
                        <Category onCategorySelect={() => { }} />
                        <TouchableOpacity style={styles.closeButton} onPress={handleCategoryClose}>
                            <Ionicons name="close-circle" size={wp('8%')} color="black" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={wp('6%')} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Account</Text>
            </View>

            <TouchableOpacity style={styles.accountImage} onPress={handleEditProfile}>
                <View style={styles.square}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage }} style={styles.image} />
                    ) : (
                        <Image
                            source={require('../assets/images/co-dang.png')}
                            style={styles.image}
                        />
                    )}
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.gmail}>{gmail}</Text>
                </View>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.functionList}>
                <TouchableOpacity onPress={handleCategoryPress} style={styles.listButton}>
                    <Ionicons name="grid" size={wp('8%')} color="#2B4D59" />
                    <Text style={styles.buttonText}>Category</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('InformationFix')} style={styles.listButton}>
                    <Ionicons name="settings-sharp" size={wp('8%')} color="#2B4D59" />
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity>
                <LogoutButton />
            </ScrollView>

        </View>
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
    accountImage: {
        alignItems: 'center',
        marginTop: hp('8%'),
    },
    square: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: wp('5%'),
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: wp('5%'),
    },
    userInfo: {
        alignItems: 'center',
        marginTop: hp('1%'),
    },
    userName: {
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
        marginTop: hp('1%'),
    },
    gmail: {
        fontSize: hp('2%'),
        color: '#777',
        marginTop: hp('0.3%'),
    },
    functionList: {
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('5%'),
    },
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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFEF6',
        padding: wp('5%'),

        width: wp('90%'),
        alignItems: 'center',
        elevation: 5,
        width: wp('100%'),
        height: hp('100%'),
    },
    closeButton: {
        position: 'absolute',
        top: hp('5%'),
        right: wp('2%'),
        padding: wp('1%'),
    }
});

export default Profile;