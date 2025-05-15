import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MonthYearPicker from '../components/MonthYearPicker';
import RecordList from '../components/RecordList';
import FilterModal from '../components/FilterModal';

const Homepage = ({ onScreenChange }) => {
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState('');
    const [selectedSort, setSelectedSort] = useState('');


    useEffect(() => {
        onScreenChange('Homepage');
    }, [onScreenChange]);

    const navigation = useNavigation();

    const handleDateChange = (date) => {
        console.log('Selected date:', date);
    };
    const handleIconPress = (icon) => {
        if (icon === 'person') {
            navigation.navigate('Profile');
        }
    };
    const onclick = () => {
        navigation.navigate('Records');
    };

    const handleRecordPress = (item) => {
        setSelectedTransaction(item);
        setIsDetailVisible(true);
    };

    const handleTransactionsChange = (newTransactions) => {
       setTransactions(newTransactions);
    };
     const handleFilterModal = (filter, sort) => {
        setSelectedFilters(filter);
        setSelectedSort(sort);

    };
     const handleApplyFilter = (filter, sort) => {
        console.log("Selected Filters : ",filter);
        console.log("Selected Sort : ",sort);
        setSelectedFilters(filter);
        setSelectedSort(sort)
        setModalVisible(false);
    };

    const totalIncome = transactions.filter((item) => item.type === 'income')
        .reduce((acc, curr) => acc + curr.amount, 0);
    console.log('income:', totalIncome);
    const totalExpense = transactions
        .filter((item) => item.type === 'expense')
        .reduce((acc, curr) => acc + curr.amount, 0);
    const totalBalance = 0 + totalIncome - totalExpense;
    console.log("totalTransactions:", transactions);

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.headerContainer}>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => handleIconPress('person')}>
                            <Ionicons name="person-circle" size={wp('7.5%')} color="#2B4D59" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.defaultText}>
                        Hi <Text style={styles.userName}>userName</Text>,
                    </Text>
                    <Text style={styles.subText}>Let's master your finances!</Text>
                    <MonthYearPicker onDateChange={handleDateChange} />
                    <View style={styles.balanceContainer}>
                        <View style={styles.totalBalance}>
                            <Text style={styles.totalBalanceTitle}>Total balance</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.totalBalanceValue}>{totalBalance.toLocaleString()}</Text>
                                <Text style={styles.totalBalanceCurrency}>VND</Text>
                            </View>
                        </View>
                        <View style={styles.catImageContainer}>
                            <Image
                                source={require('../assets/images/neko-1.png')}
                                style={styles.catImage}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={styles.expenseIncomeContainer}>
                            <View style={styles.triangleContainer}>
                                <View style={styles.triangleLeft} />
                                <View style={styles.triangleRight} />
                            </View>
                            <View style={styles.expenseContainer}>
                                <View style={styles.arrow}>
                                    <Ionicons name="arrow-up-circle" size={wp('6%')} color="#ffcf00" />
                                </View>
                                <View>
                                    <Text style={styles.expenseIncomeTitle}>Expenses</Text>
                                    <Text style={styles.expenseIncomeValue}>{totalExpense.toLocaleString()}</Text>
                                </View>
                            </View>
                            <View style={styles.incomeContainer}>
                                <View style={styles.arrow}>
                                    <Ionicons name="arrow-down-circle" size={wp('6%')} color="#22c35a" />
                                </View>
                                <View>
                                    <Text style={styles.expenseIncomeTitle}>Income</Text>
                                    <Text style={styles.expenseIncomeValue}>{totalIncome.toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.RecordList}>
                        <View style={styles.Recordheader}>
                            <Text style={styles.RecordTitle}>Records</Text>
                             <TouchableOpacity style={styles.viewAllButton} onPress={onclick} >
                                <Text style={styles.RecordviewAll}>View all</Text>
                            </TouchableOpacity>
                        </View>
                           <RecordList
                            onRecordPress={handleRecordPress}
                            onTransactionsChange={handleTransactionsChange}
                            sort={selectedSort}
                            selectedCategoryTypes={selectedFilters}
                        />
                     <View style={{ alignItems: 'flex-end'}}>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                  <Text style={{fontSize: wp('4%'), color: '#000', fontWeight: 'bold', paddingTop: hp('1%')}}>Filter</Text>
                                </TouchableOpacity>
                    </View>
                     <FilterModal
                                    isVisible={modalVisible}
                                    onClose={() => setModalVisible(false)}
                                    selectedFilters={selectedFilters}
                                    selectedSort={selectedSort}
                                    onApplyFilter={handleApplyFilter}
                                    onSelectionChange={handleFilterModal}
                                />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFEF6',
        flex: 1,
        paddingBottom: hp('10.5%'),
    },
    headerContainer: {
        flexGrow: 1,
        backgroundColor: '#FFFEF6',
        padding: wp('5%'),
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: hp('6%'),
    },
    rightIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: wp('5%'),
    },
    defaultText: {
        top: hp('2%'),
        fontSize: hp('3%'),
        color: '#000000',
    },
    userName: {
        fontSize: hp('3%'),
        fontWeight: 'bold',
        fontFamily: 'serif',
        color: '#2B4D59',
    },
    subText: {
        marginTop: hp('2%'),
        fontSize: hp('3%'),
        color: '#000000',
        marginBottom: hp('2%'),
    },
    balanceContainer: {
        backgroundColor: '#DA674A',
        borderRadius: wp('3%'),
        padding: wp('3%'),
        marginTop: hp('3%'),
    },
    totalBalance: {
        marginTop: hp('1%'),
        gap: hp('1%'),
    },
    totalBalanceTitle: {
        fontSize: wp('5%'),
        color: '#FDD773',
        fontWeight: 'bold',
    },
    totalBalanceValue: {
        fontSize: wp('7%'),
        color: '#fff',
        fontWeight: 'bold',
        marginRight: wp('1%'),
    },
    totalBalanceCurrency: {
        marginTop: hp('1%'),
        fontSize: wp('4%'),
        color: '#fff',
    },
    catImageContainer: {
        position: 'absolute',
        marginLeft: hp('28%'),
        right: 0,
        bottom: 0,
        top: hp('-5%'),
    },
    catImage: {
        width: wp('40%'),
        height: hp('33%'),
        resizeMode: 'contain'
    },
    expenseIncomeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('9%'),
        backgroundColor: '#FFFEF6',
        borderRadius: wp('3%'),
        gap: 0,
    },
    expenseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('3%'),
        borderRightWidth: 1,
        borderRightColor: '#d3d3d3',
        paddingLeft: wp('4%'),
        width: wp('42%'),
        paddingVertical: hp('3%'),
    },
    incomeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('3%'),
        width: wp('42%'),
        paddingLeft: wp('4%'),
    },
    expenseIncomeTitle: {
        fontSize: wp('4%'),
        color: '#000',
        fontWeight: 'bold',
    },
    expenseIncomeValue: {
        fontSize: wp('4%'),
        color: '#000',
    },
    arrow: {},
    triangleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 9,
    },
    triangleLeft: {
        width: 0,
        height: 0,
        borderLeftWidth: wp('6%'),
        borderLeftColor: 'transparent',
        borderRightWidth: wp('6%'),
        borderRightColor: 'transparent',
        borderBottomWidth: wp('7%'),
        borderBottomColor: '#FFFEF6',
        transform: [{ translateY: wp('5%') }],
        transform: [{ translateY: wp('-9%') }],
    },
    triangleRight: {
        width: 0,
        height: 0,
        borderLeftWidth: wp('6%'),
        borderLeftColor: 'transparent',
        borderRightWidth: wp('6%'),
        borderRightColor: 'transparent',
        borderBottomWidth: wp('7%'),
        borderBottomColor: '#FFFEF6',
        transform: [{ translateY: wp('5%') }],
        transform: [{ translateY: wp('-9%') }],
    },
    RecordList: {
        marginTop: hp('2%'),
    },
    Recordheader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('1%'),
        alignItems: 'center'
    },
    RecordTitle: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
       viewAllButton: {
        backgroundColor: '#FDD773',
        borderRadius: wp('5%'),
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('3.5%'),
    },
    RecordviewAll: {
        color: '#000000',
        fontSize: wp('3.5%'),
        fontWeight: 'bold',
    },
});

export default Homepage;