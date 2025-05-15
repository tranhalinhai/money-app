import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface DetailBudgetScreenProps {
  route: any;
}

const BudgetDetail: React.FC<DetailBudgetScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { category, startDate, endDate, budgetId } = route.params || { category: "Motorbike", startDate: "Oct 1", endDate: "Oct 15", budgetId: 1 };

  // Handle back navigation
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleEditClick = () => {
    // Chuyển hướng đến màn hình EditBudget với các tham số cần thiết
    navigation.navigate('EditBudget', {
      budgetId, // Pass the budgetId to EditBudget to identify which budget to edit
      category,
      startDate,
      endDate,
    });
  };

  // Handle trash click - show the confirmation alert
  const handleTrashClick = () => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to delete this budget?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleDelete(),
        },
      ],
      { cancelable: true } // Make the alert cancelable by tapping outside
    );
  };

  // Handle delete action
  const handleDelete = () => {
    // Implement the deletion logic here (e.g., remove the budget from the database or state)
    console.log("Budget deleted");
    // You can also navigate back or to another screen if needed
    navigation.goBack(); // Navigate back after deletion
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={wp("7%")} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Detail Budget</Text>
        <TouchableOpacity onPress={handleTrashClick}>
          <Ionicons name="trash-outline" size={wp("7%")} color="black" />
        </TouchableOpacity>
      </View>

      {/* Remaining Section */}
      <View style={styles.remainingSection}>
        <Text style={styles.remainingTitle}>Remaining</Text>
        <Text style={styles.remainingValue}>0 <Text style={styles.vnd}>VND</Text></Text>
        <Text style={styles.totalValue}>of 1,000,000 VND</Text>
        <View style={styles.progressBar}>
          <View style={styles.progress}></View>
        </View>
        <View style={styles.alertBox}>
          <Ionicons name="alert-circle" size={wp('4%')} color="#fff" />
          <Text style={styles.alertText}>You've exceeded the limit!</Text>
        </View>
      </View>

      {/* Category and Time */}
      <View style={styles.categoryTime}>
        <View style={styles.categoryBox}>
          <Text style={styles.categoryTitle}>Category</Text>
          <Text style={styles.categoryValue}>{category}</Text>
        </View>
        <View style={styles.timeBox}>
          <Text style={styles.timeTitle}>Time</Text>
          <Text style={styles.timeValue}>{startDate} - {endDate}</Text>
        </View>
      </View>

      {/* Overview Section */}
      <View style={styles.overviewSection}>
        <Text style={styles.overviewTitle}>Overview</Text>
      </View>

      {/* Edit Button */}
      <View style={styles.editButtonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditClick}
          activeOpacity={0.7} // Optionally, change opacity on press
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    paddingTop: hp('2%'),
  },
  backButton: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("3%"),
    marginHorizontal: wp('5%'),
    top: hp('5%'),
  },
  headerText: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
  },

  remainingSection: {
    alignItems: 'center',
    marginBottom: hp('3%'),
    top: hp('5%'),
  },
  remainingTitle: {
    fontSize: wp('4%'),
  },
  remainingValue: {
    fontSize: wp('8%'),
    fontWeight: 'bold',
  },
  vnd: {
    fontSize: wp('4%'),
  },
  totalValue: {
    fontSize: wp('5%'),
  },
  progressBar: {
    width: wp('90%'),
    height: hp('1%'),
    backgroundColor: '#F28B82',
    borderRadius: wp('2%'),
    top: hp('1%'),
  },
  progress: {
    height: hp('1%'),
    width: '0%',
    backgroundColor: '#FF5722',
    borderRadius: wp('2%'),
  },
  alertBox: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    borderRadius: wp('8%'),
    marginTop: hp('1%'),
    top: hp('1%'),
  },
  alertText: {
    color: '#fff',
    marginLeft: wp('2%'),
    fontSize: wp('3%'),
  },
  categoryTime: {
    backgroundColor: '#39998E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
    borderRadius: wp('5%'),
    marginHorizontal: wp('5%'),
    width: wp('70%'),
    alignItems: 'center',
    top: hp('5%'),
    alignSelf: 'center',
  },
  categoryBox: {
    flex: 1,
    padding: wp('3%'),
    borderRightWidth: 1,
    borderRightColor: 'white',
    alignItems: 'center',
  },
  timeBox: {
    flex: 1,
    padding: wp('3%'),
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: wp('3.5%'),
    color: 'white',
    marginBottom: hp('1%'),
  },
  categoryValue: {
    fontSize: wp('5%'),
    color: 'white',
    fontWeight: 'bold',
  },
  timeTitle: {
    fontSize: wp('3.5%'),
    color: 'white',
    marginBottom: hp('1%'),
  },
  timeValue: {
    fontSize: wp('3%'),
    color: 'white',
    fontWeight: 'bold',
  },
  overviewSection: {
    marginBottom: hp('3%'),
    marginHorizontal: wp('5%'),
    top: hp('5%'),
    backgroundColor: '#2B4D59',
    padding: wp('4%'),
    borderRadius: wp('5%'),
    height: hp('40%'),
  },
  overviewTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    color: 'white',
  },
  editButtonContainer: {
    alignItems: "center",
    marginBottom: hp('3%'),
  },
  editButton: {
    backgroundColor: '#FDD773',
    padding: wp('3%'),
    width: wp('90%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    top: hp('8%'),
  },
  editButtonText: {
    fontSize: wp('5%'),
  },
});

export default BudgetDetail;
