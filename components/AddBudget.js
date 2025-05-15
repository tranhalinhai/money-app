import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Calculator from "../components/Calculator";
import DatePicker from "../components/DatePicker";
import Category from "../components/Category";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddBudget = ({
  navigation, // truyền navigation từ màn hình cha
  onSave, // hàm callback để lưu ngân sách
  onCancel, // hàm callback để hủy
}) => {
  const [selectedCategory, setSelectedCategory] = useState({
    name: "Category",
    icon: "",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [result, setResult] = useState("");
  const [isCategoriesVisible, setCategoriesVisible] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoriesVisible(false);
  };

  const handleSave = async () => {
    // Chuẩn bị dữ liệu để gửi lên server
    const newBudget = {
      amount: Number(result),
      type: selectedCategory.name === "Category" ? "total" : "category",
      category_id: selectedCategory.name === "Category" ? null : selectedCategory.id,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    };
console.log("send data:", newBudget);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://172.20.10.2:5000/budget/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newBudget),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Budget created successfully:", data);

        // Gọi hàm callback onSave từ màn hình cha
        onSave(data.budget);

        // Hiển thị thông báo thành công
        Alert.alert("Success", "Budget created successfully!");

        // Quay lại màn hình trước đó
        onCancel();
      } else {
        const errorData = await response.json();
        console.log("err:",errorData);
        console.error("Failed to create budget:", errorData.error);
        Alert.alert("Error", errorData.error);
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

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
        <TouchableOpacity style={styles.footerButton} onPress={onCancel}>
          <Text style={styles.footerText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={handleSave}>
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
    top: hp("3%"),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddBudget;