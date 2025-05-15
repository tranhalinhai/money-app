import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Calculator from "../components/Calculator";
import DatePicker from "../components/DatePicker";
import Category from "../components/Category";

const EditBudget = ({
  navigation,
  onSave,
  onCancel, // hàm callback để hủy
}) => {
  const [selectedCategory, setSelectedCategory] = useState({
    name: "Category",
    icon: "",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [receiveAlert, setReceiveAlert] = useState(false);
  const [result, setResult] = useState("");
  const [isCategoriesVisible, setCategoriesVisible] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoriesVisible(false);
  };
  const handleCancel = () => {
      // Quay lại màn hình trước đó khi nhấn "Cancel"
      navigation.goBack();
    };



  return (
    <ScrollView style={styles.container}>
    <View style={styles.header}>
                  <Text style={styles.headerText}>Edit Budget</Text>
                </View>
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

      <View style={styles.dateContainer}>
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          isVisible={isStartDatePickerVisible}
          setIsVisible={setStartDatePickerVisible}
        />
        <Text style={styles.toText}>to</Text>
        <DatePicker
          date={endDate}
          setDate={setEndDate}
          isVisible={isEndDatePickerVisible}
          setIsVisible={setEndDatePickerVisible}
        />
      </View>

     <View style={styles.calculator}>
      <Calculator onResultChange={setResult} />
      </View>

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleCancel}>
          <Text style={styles.footerText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} >
          <Text style={styles.footerText}>Save</Text>
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
  },
  header: {
      fontSize: hp('3%'),
      fontWeight: 'bold',
      fontFamily: 'serif',
      color: '#2B4D59',
      textAlign: 'center',
      top: hp('5%'),
    },
    headerText: {
      fontSize: hp('3%'),
      fontWeight: 'bold',
      fontFamily: 'serif',
      color: '#2B4D59',
      textAlign: 'center',
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
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("2%"),
    bottom: hp("5%"),
  },
  toText: {
    marginHorizontal: wp("2%"),
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("5%"),
  },
  footerButton: {
    backgroundColor: "#FFE082",
    padding: hp("2%"),
    borderRadius: wp("2%"),
    width: wp("44%"),
    alignItems: "center",
  },
  footerText: {
    fontSize: wp("5%"),
  },
  calculator: {
  top: hp('3%'),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditBudget;
