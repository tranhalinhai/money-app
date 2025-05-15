import React, { useState } from 'react';
import { View, Text,TouchableOpacity, Switch, StyleSheet, ScrollView, Modal, TextInput, Keyboard, ActivityIndicator, Alert, Image} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from "../components/ImagePicker";
import Calculator from "../components/Calculator";
import DatePicker from "../components/DatePicker";
import Category from "../components/Category";
import MonthYearPicker from "../components/MonthYearPicker";// import camera

const AddTransaction = ({onScreenChange}) => {

  const [selectedCategory, setSelectedCategory] = useState({
    name: "Category",
    icon: "",
    id: ""
});
    const [date, setDate] = useState(new Date());
    const [note, setNote] = useState('');
    const [amount, setAmount] = useState('');
    const [image_url, setImageUrl] = useState('');
     const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
   const [isCategoriesVisible, setCategoriesVisible] = useState(false);
   const handleDateChange = (date) => {
        setDate(date);
    };

    const handleCategorySelect = (category) => {
         setSelectedCategory(category);
        setCategoriesVisible(false);
      };
const handlePickImage = (imageUri) => {
      setImageUrl(imageUri);
   };
    const handleBlur = () => {
        Keyboard.dismiss();
    };

    const formatDateForMySQL = (date) => {
        const isoString = date.toISOString(); // "2025-01-06T04:02:00.000Z"
        return isoString.replace("T", " ").split(".")[0]; // "2025-01-06 04:02:00"
    };

     const handleSubmit = async () => {
         setIsLoading(true);
      try {
      const token = await AsyncStorage.getItem('userToken');
      const formattedDate = formatDateForMySQL(date);
          const response = await fetch('http://172.20.10.2:5000/transactions/create', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                  amount: Number(amount),
                  date: formattedDate,
                  note,
                  category_id: selectedCategory.id,
                  image_url: image_url || '',
              }),
          });

          console.log("Raw response:", response);

          const responseText = await response.text(); // Lấy dữ liệu dưới dạng văn bản
          console.log("Response text:", responseText);

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = JSON.parse(responseText); // Parse JSON sau khi đảm bảo nội dung
          console.log("Parsed data:", data);

          Alert.alert("Success", "Transaction added successfully");
          navigation.navigate('Records');
      } catch (error) {
          console.error("Error:", error);
          Alert.alert('Error', 'Something went wrong. Check console logs.');
      } finally {
          setIsLoading(false);
      }
    }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => setCategoriesVisible(true)}
      >
        <Text style={styles.categoryText}>{selectedCategory.name}</Text>
        <Ionicons name="chevron-down" size={wp("7%")} color="black" />
      </TouchableOpacity>
      <Modal
        visible={isCategoriesVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCategoriesVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Category
            onCategorySelect={handleCategorySelect}
            onClose={() => setCategoriesVisible(false)}
          />
        </View>
      </Modal>

      <View style={styles.monthYearPicker}>
          <MonthYearPicker onDateChange={handleDateChange} />
        </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.headerText}>Description</Text>
        <View style={styles.description}>
          {/* New Text Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Enter text here"
            value={note}
            onChangeText={(text) => setNote(text)}
            multiline={true}
            textAlignVertical="top"
            returnKeyType="done" // Change return key to "done"
            onSubmitEditing={handleBlur} // Dismiss keyboard on submit
            blurOnSubmit={true}
            onBlur={handleBlur} //Dismiss keyboard when submit is done
          />
        </View>
      </View>
      <View style={styles.imagePreviewContainer}>
        {image_url ? (
          <Image source={{ uri: image_url }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePlaceholderText}>No image selected</Text>
        )}
      </View>
      <ImagePicker onPickImage={handlePickImage} />
      <Calculator onResultChange={setAmount} />

      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
                      onScreenChange('Homepage'); // Cập nhật trạng thái activeScreen
                      navigation.navigate('Homepage'); // Điều hướng về Homepage
                    }}
        >
          <Text style={styles.footerText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={handleSubmit}
        >
          <Text style={styles.footerText}>Save</Text>
           {isLoading ? <ActivityIndicator color="#000" style={{marginLeft:10}} /> : null}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("5%"),
    backgroundColor: "#FFF8E1",
    paddingTop: hp("-5%"),
  },
  categoryButton: {
    backgroundColor: "#FFAA67",
    padding: hp("2%"),
    borderRadius: wp("2%"),
    alignItems: "center",
    marginBottom: hp("15%"),
    flexDirection: "row",
    justifyContent: "center",
    top: hp("8%"),
  },
  categoryText: {
    fontSize: wp("5%"),
  },
  monthYearPicker: {
    marginVertical: hp("2%"),
    alignSelf: "center",
    width: wp("90%"),
    top: hp("-8%"),
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("2%"),
  },
  footerButton: {
    backgroundColor: "#FFE082",
    padding: hp("2%"),
    borderRadius: wp("2%"),
    width: wp("44%"),
    alignItems: "center",
      flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: wp("5%"),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  descriptionContainer: {
    width: wp('90%'),
    marginTop: hp('-8%'),
  },
  headerText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    color: '#333',
  },

  description: {
    borderRadius: 10,
    padding: hp('1%'),
  },

  textInput: {
    borderWidth: 4,
    borderColor: "#FFA500",
    borderRadius: wp("3%"),
    padding: hp("1.5%"),
    fontSize: wp("4.5%"),
    backgroundColor: "#FFF",
    marginBottom: hp("2%"),
    width: wp("90%"),
    alignSelf: "center",
    minHeight: hp('6%'),
  },
  imagePreviewContainer: {
      alignItems: 'center',
      marginVertical: hp("2%"),
    },
    imagePreview: {
      width: wp("60%"),
      height: wp("60%"),
      borderRadius: wp("3%"),
      borderWidth: 2,
      borderColor: "#FFA500",
      resizeMode: "cover",
    },
    imagePlaceholderText: {
      fontSize: wp("4%"),
      color: "#999",
    },
});

export default AddTransaction;