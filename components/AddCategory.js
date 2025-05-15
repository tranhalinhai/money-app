import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TypeCategoryDropdown from '../components/TypeCategoryDropdown';
import IconPicker from '../components/IconPicker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage


const AddCategory = ({ onClose }) => {
    const [categoryName, setCategoryName] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Danh sách tên icons (bạn có thể thêm hoặc bớt tùy ý) - đảm bảo tên icon tồn tại trong Ionicons
    const icons = [
        'alarm-outline', 'earth-outline', 'train', 'barbell-outline', 'flower-outline', 'fish-outline', 'walk', 'subway', 'key-outline', 'car-sport', 'paw-outline',
        'book', 'star','language', 'home', 'code', 'skull-outline',
        'snow-outline', 'sparkles-outline', 'thunderstorm-outline',
        'videocam-outline', 'logo-javascript', 'logo-npm','logo-figma',
        'diamond', 'extension-puzzle', 'finger-print','globe',
        'logo-tiktok', 'logo-react', 'bowling-ball','chatbubbles',
        'ice-cream', 'musical-notes', 'pizza','qr-code',
        'sad', 'umbrella', 'water','woman',
        'time-sharp', 'push', 'planet','nuclear',
        'ribbon', 'speedometer', 'thumbs-up','thumbs-down',
        'logo-discord', 'logo-microsoft', 'logo-snapchat','logo-wordpress',
    ];


    const handleTypeSelect = (type) => {
        setSelectedType(type);
        console.log("Selected type:", type);
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handlePickIcon = () => {
        setShowIconPicker(true); // Now, just set showIconPicker to true
    };

    const handleIconSelect = (iconName) => {
        setSelectedIcon(iconName);
        console.log("Selected icon:", iconName);
        setShowIconPicker(false);
    };

    const handleSave = async () => {
        if (!categoryName || !selectedType || !selectedIcon) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setIsLoading(true);

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error("User token not found.  Please log in.");
            }

            const response = await fetch('http://172.20.10.2:5000/cate/create', { // Replace with your API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include the token in the header
                },
                body: JSON.stringify({
                    name: categoryName,
                    type: selectedType,
                    icon: selectedIcon,
                }),
            });
            console.log("Raw response:", response);
            if (!response.ok) {
                const errorData = await response.json();
                console.log("lỗi:", errorData);// Try to get a JSON error response from the server
                const errorMessage = errorData.message || 'Failed to create category'; // Use a default message if the server doesn't provide one.
                throw new Error(errorMessage); // Throw a more descriptive error
            }

            const responseText = await response.text();
            const data = JSON.parse(responseText); // Parse the successful JSON response
            console.log("Parsed data:", data);
            Alert.alert("Success", "Category added successfully");
            onClose();
        } catch (error) {
            console.error("Error:", error); // Log the caught error (which could be a network error or the server error)
            Alert.alert('Error', error.message); // Display the specific error message to the user.
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={wp('6%')} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Category</Text>
            </View>

            <View style={styles.editContainer}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity
                        style={styles.avatarPlaceholder}
                        onPress={handlePickIcon}
                        disabled={showIconPicker}
                    >
                        {selectedIcon ? (
                            <Ionicons name={selectedIcon} size={wp('10%')} color="black" />
                        ) : (
                            <Text style={styles.textnoicon}>No icon selected</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handlePickIcon}
                    style={styles.pickIconButton}
                    disabled={showIconPicker}
                >
                    <Text style={styles.pickIconText}>Pick an Icon</Text>
                </TouchableOpacity>

                {/* Dropdown to select category type */}
                <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
                    <Text style={{ fontSize: hp('2%') }}>{selectedType || "Select Type"}</Text>
                </TouchableOpacity>

                <TypeCategoryDropdown
                    isVisible={showDropdown}
                    onTypeSelect={handleTypeSelect}
                    style={styles.dropdownPlacement}
                />



                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Category Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter category name"
                        value={categoryName} // Bind the input value to state
                        onChangeText={setCategoryName} // Update state on text change
                    />
                </View>


                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save New Category</Text>
                </TouchableOpacity>


                {showIconPicker && (
                    <IconPicker
                        isVisible={showIconPicker} // Pass showIconPicker directly to IconPicker
                        onSelectIcon={handleIconSelect}
                        selectedIcon={selectedIcon}
                        label="Select an Icon"
                        icons={icons} // Pass the icons array
                        style={styles.iconPickerPlacement}
                    />
                )}

            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFEF6',
        position:'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: hp('2%'),
        top: 0,
    },
    backButton: {
        padding: wp('2%'),
    },

    textnoicon: {
        fontWeight: 'bold',
    },

    headerTitle: {
        fontSize: hp('3%'),
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        marginLeft: wp('21%'),
    },
    editContainer: {
        padding: wp('5%'),
        marginTop: hp('3%'),
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
        backgroundColor: '#FDD773',

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

    dropdownButton: { // Style the button to toggle
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 30, // Space below for dropdown
    },
    dropdownPlacement: { // Style the dropdown's position
         position:'absolute',
         top: hp('35%'), // Adjust top as needed
         left: wp('5%'),   // Adjust left/right as needed
         right: wp('5%'),
         zIndex: 2, // Ensure it's above other elements
    },

    iconPickerPlacement: {
        position: 'absolute',
        top: hp('16%'),       // Adjust as needed
        left: wp('5%'),
        right: wp('5%'),
        backgroundColor: 'white', // Or a suitable background color
        zIndex: 1,            // Ensure it's above other components
        borderRadius: 8,
        padding: 10,
    },

    pickIconButton: {
        backgroundColor: '#FDD773', // Or any suitable color
        padding: hp('1%'),
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: hp('5%'), // Space below the button
    },
    pickIconText: { // Style for text inside the button
      color: '#000',
      fontSize: hp('2%'),
      fontWeight: '500' // Or any suitable weight

    },
});


export default AddCategory;