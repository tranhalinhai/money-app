import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RecordList from '../components/RecordList';
import FilterModal from '../components/FilterModal';
import TimeDropdown from '../components/TimeDropdown';
import TransactionHeader from '../components/TransactionHeader';
import Report from '../components/Report';
import DetailTransaction from '../components/DetailTransaction';
import { Ionicons } from '@expo/vector-icons';

const Records = ({ onScreenChange }) => {
    useEffect(() => {
        onScreenChange('Records');
    }, [onScreenChange]);

    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('transactions');
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [selectedSort, setSelectedSort] = useState('');
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [timeStates, setTimeStates] = useState({
        transactions: { isTimeDropdownVisible: false, selectedTime: 'Week' },
    });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [tempFilters, setTempFilters] = useState('');
    const [tempSort, setTempSort] = useState('');
     const [transactionsCategoryTypes, setTransactionsCategoryTypes] = useState(''); // Bộ lọc riêng cho tab transactions


    const handleFilterPress = () => {
        setIsFilterModalVisible(true);
        setTempFilters(selectedFilters.transactions || '');
        setTempSort(selectedSort);
    };

    const closeFilterModal = () => {
        setIsFilterModalVisible(false);
    };


    const handleApplyFilter = (filters, sort) => {
        console.log('Records: Apply filter, filters:', filters, 'sort:', sort)
        setSelectedFilters(prev => ({
            ...prev,
            transactions: filters,
        }));
        setSelectedSort(sort);
          setTransactionsCategoryTypes(filters); // Cập nhật bộ lọc riêng cho tab transactions
        setIsFilterModalVisible(false);
    };

    const handleSelectionChange = (filters, sort) => {
        setTempFilters(filters);
        setTempSort(sort);
        console.log('Records: temp selection change, filters:', filters, 'sort:', sort)
          setTransactionsCategoryTypes(filters); // Cập nhật bộ lọc riêng cho tab transactions
    }

    const handleTimePress = (tab) => {
        setTimeStates((prev) => ({
            ...prev,
            [tab]: {
                ...prev[tab],
                isTimeDropdownVisible: !prev[tab].isTimeDropdownVisible,
            },
        }));
    };

    const handleTimeSelect = (tab, time) => {
        setTimeStates((prev) => ({
            ...prev,
            [tab]: {
                ...prev[tab],
                selectedTime: time,
                isTimeDropdownVisible: false,
            },
        }));
    };

    const handleRecordPress = (item) => {
        setSelectedTransaction(item);
        console.log("id trả về:", item.id);
        setIsDetailVisible(true);
    };

    const handleCloseDetail = () => {
        setIsDetailVisible(false);
    };

    const renderContent = () => {
        if (activeTab === 'transactions') {
            const { isTimeDropdownVisible, selectedTime } = timeStates.transactions;
            const categoryFilters = selectedFilters.transactions || '';
             const shouldApplyFilter = categoryFilters !== '' || selectedSort !== '';
            console.log("Records: shouldApplyFilter", shouldApplyFilter);
            console.log("Records: categoryFilters", categoryFilters)


            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <TransactionHeader
                            selectedTime={selectedTime}
                            onTimePress={() => handleTimePress('transactions')}
                            onFilterPress={handleFilterPress}
                        />
                    </View>

                    <TimeDropdown
                        isVisible={isTimeDropdownVisible}
                        onTimeSelect={(time) => handleTimeSelect('transactions', time)}
                    />

                    <View style={styles.recordListContainer}>
                        <RecordList
                             selectedTime={selectedTime} // Pass selected time
                            sort={selectedSort}
                            selectedCategoryTypes={transactionsCategoryTypes} // Truyền bộ lọc riêng cho tab transactions
                            onRecordPress={handleRecordPress}
                        />
                    </View>


                    <FilterModal
                        isVisible={isFilterModalVisible}
                        onClose={closeFilterModal}
                         selectedFilters={tempFilters}
                         selectedSort={tempSort}
                        onApplyFilter={handleApplyFilter}
                        onSelectionChange={handleSelectionChange}
                    />
                </View>
            );
        } else if (activeTab === 'report') {
            return (
                <Report />
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.headerContainer}>
                    <View style={styles.tabBar}>
                        <TouchableOpacity
                            onPress={() => setActiveTab('transactions')}
                            style={[styles.tabButton, activeTab === 'transactions' && styles.activeTab]}
                        >
                            <Text>Transactions</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab('report')}
                            style={[styles.tabButton, activeTab === 'report' && styles.activeTab]}
                        >
                            <Text>Report</Text>
                        </TouchableOpacity>
                    </View>
                    {renderContent()}
                    {isDetailVisible && selectedTransaction && (
                        <View style={styles.detailContainer}>
                            <DetailTransaction
                                route={{ params: {transactionId : selectedTransaction.id} }}
                                onClose={handleCloseDetail}
                            />
                        </View>
                    )}
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
        paddingLeft: wp('5%'),
        paddingRight: wp('5%'),
    },
    tabBar: {
        flexDirection: 'row',
        marginBottom: hp('3%'),
        width: wp('90%'),
        marginTop: hp('6%'),
        justifyContent: 'center',
    },
    tabButton: {
        flex: 1,
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: 'black',
    },
    header: {
        alignItems: 'flex-start',
        marginBottom: hp('2%'),
        flexDirection: 'row',
    },
    recordListContainer: {
        flex: 1,
    },
    detailContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Records;