import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MonthYearPicker from '../components/MonthYearPicker';
import Category from '../components/Category';
import ImagePicker from "../components/ImagePicker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditTransaction = ({ route, onClose, onSave }) => {
  const {
    amount: initialAmount,
    title: initialTitle,
    subtitle: initialSubtitle,
    date: initialDate,
    category_id,
    image_url,
  } = route.params;
console.log("edit:", route.params);
  const [amount, setAmount] = useState(initialAmount);
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [date, setDate] = useState(new Date(initialDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(image_url);

  const handlePickImage = (imageUri) => {
        setSelectedImage(imageUri);
     };
const formatDateForMySQL = (date) => {
        const isoString = date.toISOString(); // "2025-01-06T04:02:00.000Z"
        return isoString.replace("T", " ").split(".")[0]; // "2025-01-06 04:02:00"
    };
  const handleSave = async () => {
  const transactionId = route.params?.transactionId;
    if (!amount || !title || !subtitle) {
      Alert.alert('Validation Error', 'All fields must be filled.');
      return;
    }

    setIsSaving(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
        const formattedDate = formatDateForMySQL(date);
      const response = await fetch(`http://172.20.10.2:5000/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          note: subtitle,
          date: formattedDate,
          category_id,
          image_url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("error", errorData);
        throw new Error(errorData.message || 'Failed to save transaction.');
      }

      const updatedTransaction = await response.json();
      console.log("Request Body:", updatedTransaction);
      onSave(updatedTransaction); // Pass the updated transaction to the parent
      onClose(); // Close the modal
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

    const handleClose = () => {
        onClose();
    };

    const handleClearNotes = () => {
        setEditedNotes('');
    };

    const handleClearImage = () => {
        setSelectedImage(null); // Xoá ảnh
    };

    const handleOpenCategory = () => {
      setIsCategoryVisible(true);
    };

   const handleCloseCategory = () => {
        setIsCategoryVisible(false);
    };
   const handleCategorySelect = (category) => {
       setTitle(category.name);
        setIsCategoryVisible(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleClose}>
                        <Ionicons name="arrow-back" marginLeft={wp('3%')} size={wp('7%')} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Transaction</Text>
                    <View style={{marginRight: wp('10%')}}></View>
                </View>

                <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="Amount"
                    keyboardType="number-pad"
                />
                <TextInput
                    style={styles.subtitleInput}
                    value={subtitle}
                    onChangeText={setSubtitle}
                    placeholder="Subtitle"
                />
              <View style={styles.date}>
                <MonthYearPicker
                    initialDate={date}
                     onDateChange={handleDateChange}
                   />
               </View>


                <ScrollView style={styles.darkBGcontainer}>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionLabel}>Description</Text>
                        <TextInput
                            style={styles.descriptionInput}
                            value={subtitle}
                            onChangeText={setSubtitle}
                            multiline
                            placeholder="Description"
                        />
                    </View>

                     <View style={styles.notesContainer}>
                         <Text style={styles.notesLabel}>Image</Text>
                       {selectedImage ? (
                            <View style={styles.imageContainer}>
                                 <Image source={{ uri: selectedImage}} style={styles.notesImage} resizeMode="contain"/>
                                 <TouchableOpacity style={styles.removeImageButton} onPress={handleClearImage}>
                                       <Ionicons name="trash-outline" size={wp('5%')} color="#fff" />
                                </TouchableOpacity>
                                 <TouchableOpacity style={styles.addImageButton}>
                                       <Ionicons name="camera" size={wp('5%')} color="#fff" />
                                </TouchableOpacity>
                             </View>

                            ) : (
                                  <View style={styles.notesInputContainer}>
                                        <TouchableOpacity onPress={handleClearNotes}>
                                            <Ionicons name="trash-outline" size={wp('5%')} color="#fff" />
                                        </TouchableOpacity>
                                        <TouchableOpacity>
                                            <Ionicons name="camera" size={wp('5%')} color="#fff" />
                                        </TouchableOpacity>
                                        <ImagePicker onPickImage={handlePickImage} />
                                    </View>
                             )}
                             <ImagePicker onPickImage={handlePickImage} />
                    </View>
                </ScrollView>

                <View style={styles.typeTitleContainer}>
                    <View style={styles.typeButton}>
                        <Text style={styles.typeText}>Type</Text>
                        <Text style={styles.typeValue}>Expense</Text>
                    </View>
                   <View style={styles.titleButton}>
                        <Text style={styles.titleText}>Category</Text>
                            <TouchableOpacity  onPress={handleOpenCategory} style={styles.titleButtonContainer}>
                             <Text style={styles.titleValue}> {title}</Text>
                                   <Ionicons name="pencil" size={wp('4%')} color="#fff" />
                           </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
              <Modal visible={isCategoryVisible} animationType="slide" transparent={true}>
                 <Category onCategorySelect={handleCategorySelect} />
            </Modal>
        </View>
    );
};


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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    headerTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
     amountInput: {
        fontSize: wp('8%'),
        fontWeight: 'bold',
        marginTop: 0,
        textAlign: 'center',
         borderBottomWidth: 1,
         borderColor: '#ccc',
         marginHorizontal: wp('2%')
    },
    subtitleInput: {
        fontSize: wp('5%'),
        marginTop: 0,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
         borderBottomWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: wp('5%')
    },
      date: {
        marginHorizontal: wp('2%'),
        marginVertical: 0,
        position:'absolute',
        top: hp('17%'),
        alignSelf:'center',
    },
    typeTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: hp('30%'),
        gap: wp('1%'),
        width: wp('70%'),
        alignSelf: 'center',
        position: 'absolute',
    },
    typeButton: {
        flex: 1,
        backgroundColor: '#45ADA8',
        paddingVertical: hp('1.5%'),
        alignItems: 'center',
        borderRadius: wp('3%'),
    },
     titleButton: {
        flex: 1,
         backgroundColor: '#45ADA8',
        paddingVertical: hp('1.5%'),
        alignItems: 'center',
        borderRadius: wp('3%'),
    },
      titleButtonContainer: {
        flexDirection:'row', 
        justifyContent:'space-between', 
        alignItems:'center', 
        width: wp('30%'),
    },
     typeText: {
        fontSize: wp('3.5%'),
         color: '#fff',
         fontWeight: 'bold',
    },

    typeValue: {
        fontSize: wp('3.5%'),
        color: '#fff',
        fontWeight: 'normal',
    flex: 1,
        textAlign:'left',
    },

     titleValue: {
       fontSize: wp('3.5%'),
         color: '#fff',
         fontWeight: 'normal',
     flex: 1,
         textAlign:'center',

    },
    titleText: {
        fontSize: wp('3.5%'),
         color: '#fff',
        fontWeight: 'bold',
    },
  

    darkBGcontainer: {
      backgroundColor: '#2B4D59',
      borderTopLeftRadius:  wp('10%'),
      borderTopRightRadius:  wp('10%'),
      marginTop: hp('18%'),
       marginBottom: 0,
      paddingTop: hp('4%'),
    },

     descriptionContainer: {
        marginTop: hp('2%'),
         backgroundColor: '#2B4D59',
         padding: wp('4%'),
         borderRadius: wp('2%'),
        marginLeft:  wp('3%'),
        marginRight:  wp('3%'),
    },
     descriptionLabel: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
          color: '#fff',
      marginBottom: hp('1%'),
    },
    descriptionInput: {
        fontSize: wp('3.5%'),
        color: '#fff',
         borderBottomWidth: 1,
        borderColor: '#fff'
    },
    notesContainer: {
        marginTop: hp('2%'),
         backgroundColor: '#2B4D59',
         padding: wp('4%'),
         borderRadius: wp('2%'),
         gap: hp('1%'),
         marginLeft:  wp('3%'),
         marginRight:  wp('3%'),
    },

    notesLabel: {
       fontSize: wp('4.5%'),
        fontWeight: 'bold',
         color: '#fff',
    },
   notesInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('2%'),
    },
    notesInput: {
        flex: 1,
        fontSize: wp('3.5%'),
         color: '#fff',
    },
        imageContainer: {
        flexDirection: 'row',
         alignItems: 'center',
          justifyContent: 'space-between',
    },
        notesImage: {
         width: '80%',
        height: hp('25%'),
         marginRight: wp('2%')
    },
    removeImageButton: {
      paddingRight: 0,
    },
    
    addImageButton: {
        paddingRight: 0,
        paddingLeft: 0,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 0,
        marginBottom: 0,
        paddingBottom: hp('5%'),
        paddingHorizontal: wp('3%'),
        backgroundColor: '#2B4D59',
    },
    cancelButton: {
         backgroundColor: '#F4F4F4',
        paddingVertical: hp('2%'),
        alignItems: 'center',
         borderRadius: wp('1.5%'),
         flex: 1,
        marginHorizontal: wp('1%'),
    },
    saveButton: {
        backgroundColor: '#FDD773',
        paddingVertical: hp('2%'),
         alignItems: 'center',
        borderRadius: wp('1.5%'),
        flex: 1,
         marginHorizontal: wp('1%'),
    },
    buttonText: {
        fontSize: wp('5%'),
         color: '#000',
        fontWeight: 'bold',
    },
  });


export default EditTransaction;