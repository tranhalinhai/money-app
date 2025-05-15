import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import BudgetedCategory from '../components/BudgetedCategory';
import AddBudget from '../components/AddBudget';

const Budget = ({ onScreenChange }) => {
  const [budgetedCategories, setBudgetedCategories] = useState([]);
  const [isAddBudgetVisible, setAddBudgetVisible] = useState(false);
  const route = useRoute();
  const navigation = useNavigation(); // Thêm dòng này

  const handleShowAddBudget = () => {
    setAddBudgetVisible(true);
  };

  useEffect(() => {
      if (onScreenChange) {
        onScreenChange('Budget'); // Truyền 'Budget' để kích hoạt biểu tượng
      }
      if (route.params?.newBudget) {
        setBudgetedCategories((prev) => [...prev, route.params.newBudget]);
      }
    }, [onScreenChange],[route.params?.newBudget]);

  const handleDateChange = (date) => {
    console.log('Selected date:', date);
  };

  const handleAddBudget = (newBudget) => {
    setBudgetedCategories((prev) => [...prev, newBudget]);
    setAddBudgetVisible(false); // Đóng modal sau khi thêm ngân sách
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Budget</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {budgetedCategories.length === 0 ? (
            <View style={styles.content}>
              <Text style={styles.emptyText}>It's empty...</Text>
              <Image
                source={require('../assets/images/neko-3.png')}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.createBudgetText}>Create your first budget</Text>
              <Text style={styles.setLimit}>Let’s set limits on your spending!</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAddBudgetVisible(true)}
              >
                <Text style={styles.addButtonText}>Add a budget</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={budgetedCategories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <BudgetedCategory
                  category={item.category}
                  amount={item.amount}
                  spent={item.spent}
                  startDate={item.startDate}
                  endDate={item.endDate}
                  icon={item.icon}
                  handleAddBudget={handleShowAddBudget}
                  navigation={navigation} // Truyền navigation
                />
              )}
              contentContainerStyle={styles.budgetList}
            />
          )}
        </View>
      </ScrollView>

      {/* Modal for AddBudget */}
      <Modal
        visible={isAddBudgetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddBudgetVisible(false)}
      >
        <View style={styles.modalContainer}>
          <AddBudget
            onSave={handleAddBudget}
            onCancel={() => setAddBudgetVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF6',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('5%'),
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
    top: 0,
  },

  content: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  emptyText: {
    fontSize: hp('2%'),
    color: '#2B4D59',
    bottom: hp('-6%'),
    textAlign: 'center',
  },
  createBudgetText: {
    fontSize: hp('5%'),
    fontWeight: 'bold',
    color: '#2B4D59',
    top: hp('-3%'),
    textAlign: 'center',
  },
  image: {
    width: wp('80%'),
    height: wp('80%'),
    marginTop: hp('4%'),
  },
  setLimit: {
    fontSize: hp('2%'),
    color: '#2B4D59',
    textAlign: 'center',
    top: hp('-2%'),
  },
  addButton: {
    backgroundColor: '#FDD773',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('10%'),
    borderRadius: hp('1%'),
    alignItems: 'center',
    width: wp('90%'),
    marginTop: hp('-1%'),
  },
  addButtonText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#2B4D59',
  },
  budgetList: {
    paddingBottom: hp('5%'),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Budget;
