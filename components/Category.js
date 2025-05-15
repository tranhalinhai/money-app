import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddCategory from "../components/AddCategory";

const Category = ({ onCategorySelect }) => {
    const [categoryType, setCategoryType] = useState('expense');
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddCategory, setShowAddCategory] = useState(false);


    const handleSelectCategory = (category) => {
        onCategorySelect(category);
    };
const handleTabPress = (type) => {
      setCategoryType(type);
  };

  const handleAddCategoryPress = () => {
          setShowAddCategory(true);  // Show the AddCategory modal/screen
      };

      const handleCloseAddCategory = () => {
          setShowAddCategory(false); // Hide the AddCategory modal/screen
      }

    useEffect(() => {
       const fetchCategories = async () => {
          try {
             const token = await AsyncStorage.getItem('userToken');
             console.log('Token gửi đi:', token);
            const response = await fetch('http://172.20.10.2:5000/cate/', {
                            headers: {
                               'Authorization': `Bearer ${token}`,
                            }
                           })
             const data = await response.json();
           if (response.ok){
                 setCategories(data.categories)
              } else {
                console.log(data)
                 Alert.alert('Lỗi', 'Không thể lấy được danh mục');
              }
           } catch(error){
              console.error(error)
              Alert.alert('Lỗi', 'Có lỗi xảy ra khi lấy danh mục');
           } finally {
              setIsLoading(false);
           }
       };
          fetchCategories();
    }, []);

    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleSelectCategory(item)}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={wp('6%')} color="#000" />
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

     const getCategory = (type) => {
            return categories?.filter(item => item.type === type)
         }

    return (
        <View style={styles.container}>
           {isLoading? <ActivityIndicator color="black" style={{ marginTop: 20}} /> :
                <>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, categoryType === 'expense' && styles.activeTab]}
                    onPress={() => handleTabPress('expense')}
                >
                    <Text style={[styles.tabText, categoryType === 'expense' && styles.activeTabText]}>Expenses</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, categoryType === 'income' && styles.activeTab]}
                    onPress={() => handleTabPress('income')}
                >
                    <Text style={[styles.tabText, categoryType === 'income' && styles.activeTabText]}>Income</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.listBigContainer}>
                            <FlatList
                                data={getCategory(categoryType)}
                                renderItem={renderCategory}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={styles.listContainer}
                            />
                        </View>

<TouchableOpacity style={styles.addButton} onPress={handleAddCategoryPress}>
               <Text style={styles.addButtonText}>Add New Category</Text>
            </TouchableOpacity>

            {showAddCategory && (
                <AddCategory
                   onClose={handleCloseAddCategory}  // Pass the close function
                />
            )}
           </>
              }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFEF6',
        paddingTop: hp('10%'),
        width: wp('100%'),
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: hp('2%'),
    },
    tab: {
        flex: 1,
        paddingVertical: hp('1.5%'),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: wp('2%'),
        marginHorizontal: wp('3%'),
    },
    activeTab: {
        backgroundColor: '#FDD773',
        borderColor: '#FDD773',
    },
    tabText: {
        fontSize: wp('4%'),
        color: '#000',
    },
    activeTabText: {
        fontWeight: 'bold',
    },
    listBigContainer: {
        top: hp('0.5%'),
        marginBottom: hp('20%'),
    },

    listContainer: {
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('1%'),
    },

    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%'),

    },
    iconContainer: {
        width: wp('12%'),
        height: wp('12%'),
        backgroundColor: '#FDD773',
        borderRadius: wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('3%'),
    },
    categoryName: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        flex: 1,
    },
    addButton: {
         backgroundColor: '#FDD773',
        borderRadius: wp('2%'),
        paddingVertical: hp('2%'),
        alignItems: 'center',
         position: 'absolute',
        bottom: hp('3%'),
        left: wp('4%'),
         right: wp('4%'),
    },
    addButtonText: {
        fontSize: wp('4.5%'),
         fontWeight: 'bold',
         color: '#000',
    },
});

export default Category;