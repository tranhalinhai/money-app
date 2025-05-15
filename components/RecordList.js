import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RecordList = ({ onRecordPress, onTransactionsChange, sort, selectedCategoryTypes, selectedTime }) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredTransactions, setFilteredTransactions] = useState([]);


useEffect(() => {
    const fetchTransactions = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch('http://172.20.10.2:5000/transactions/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            console.log("RecordList: Raw response:", response);
            const data = await response.json();
            if (response.ok) {
                const allTransactions = data.transactions;
                setTransactions(allTransactions);
                if (onTransactionsChange) {
                     onTransactionsChange(allTransactions);
                } else {
                   console.log("RecordList: onTransactionsChange is undefined, props is not passed!");
               }

                console.log("RecordList: Transactions fetched successfully:", allTransactions);

            } else {
                Alert.alert('Lỗi', 'Không thể lấy transaction');
                console.log("RecordList: Error when fetch", data)
            }
        } catch (error) {
            console.error("RecordList: Error when fetching transactions:", error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };
    fetchTransactions();
}, []);



useEffect(() => {
     console.log("RecordList: useEffect triggered - sort:", sort, "selectedCategoryTypes:", selectedCategoryTypes, "selectedTime:", selectedTime);
    let tempTransactions = [...transactions];
    console.log("RecordList: tempTransactions before:", tempTransactions);

    if (selectedCategoryTypes && selectedCategoryTypes.length > 0) {
        console.log("RecordList: Category filter applied", selectedCategoryTypes)
        tempTransactions = tempTransactions.filter(transaction =>
            selectedCategoryTypes.includes(transaction.type)
        );
    }

     // Time based filtering
    if (selectedTime === 'Day') {
         console.log("RecordList: Day filter applied")
        tempTransactions = tempTransactions.filter(transaction => {
             const transactionDate = new Date(transaction.date);
             const today = new Date();
             return (
                transactionDate.getDate() === today.getDate() &&
                transactionDate.getMonth() === today.getMonth() &&
                transactionDate.getFullYear() === today.getFullYear()
            );
        })

    } else if(selectedTime === 'Week') {
         console.log("RecordList: Week filter applied")
        tempTransactions = tempTransactions.filter(transaction => {
              const transactionDate = new Date(transaction.date);
              const today = new Date();
              const startOfWeek = new Date(today);
              startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
              const endOfWeek = new Date(today);
               endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // End of the week (Saturday)

             return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        });
     }else if (selectedTime === 'Month'){
         console.log("RecordList: Month filter applied")
        tempTransactions = tempTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const today = new Date();

             return (
              transactionDate.getMonth() === today.getMonth() &&
               transactionDate.getFullYear() === today.getFullYear()
             );
        });
     } else if(selectedTime === 'Year') {
         console.log("RecordList: Year filter applied")
         tempTransactions = tempTransactions.filter(transaction => {
             const transactionDate = new Date(transaction.date);
             const today = new Date();

             return (
                 transactionDate.getFullYear() === today.getFullYear()
             )
         })
    }


    if (sort) {
        console.log("RecordList: Sort is applied", sort)
        tempTransactions.sort((a, b) => {
            if (sort === 'Highest') {
                return b.amount - a.amount;
            }
            if (sort === 'Lowest') {
                return a.amount - b.amount;
            }
            return 0;
        });
    }

    setFilteredTransactions(tempTransactions);
    console.log("RecordList: tempTransactions after:", tempTransactions);
    console.log("RecordList: Filtered Transactions:", tempTransactions);
}, [transactions, sort, selectedCategoryTypes, selectedTime]);


    const renderTransactionItem = ({ item, index }) => {
        console.log("RecordList: Render item:", item);

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        };

        return (
            <View key={item.id.toString()} style={index === 0 ? styles.sectionWrapper : {}}>
                <Text style={styles.sectionTitle}>
                    {formatDate(item.date)}
                </Text>
                <TouchableOpacity onPress={() => onRecordPress(item)}>
                    <View style={styles.recordItem}>
                        <View style={styles.iconContainer}>
                            <Ionicons name={item.icon} size={wp('7%')} color="#000" />
                        </View>
                        <View style={styles.recordDetails}>
                            <Text style={styles.recordTitle}>{item.name}</Text>
                            <Text style={styles.recordSubTitle}>{item.note}</Text>
                        </View>
                        <View style={styles.recordAmountContainer}>
                            <Text style={[styles.recordAmount, { color: item.type === 'expense' ? 'red' : 'green' }]}>
                                {`${item.type === 'expense' ? '- ' : '+ '}${item.amount}`} VND</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {isLoading ? <ActivityIndicator color="black" style={{ marginTop: 20 }} /> :
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderTransactionItem}
                    keyExtractor={(item) => item.id?.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            }
        </View>
    );

};

const styles = StyleSheet.create({
    container: {},
    sectionWrapper: {
        marginTop: hp('2%'),
    },
    sectionTitle: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
        color: '#525E6A',
    },
    recordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%'),
        gap: wp('2.3%'),
        borderTopWidth: 1,
        paddingTop: hp('1.5%'),
        borderTopColor: '#5E6368'
    },
    iconContainer: {
        backgroundColor: '#FDD773',
        borderRadius: wp('1.5%'),
        padding: wp('3%'),
    },
    recordDetails: {
        flex: 1,
        gap: wp('1.5%'),
    },
    recordTitle: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
    },
    recordSubTitle: {
        fontSize: wp('3.5%'),
        color: '#525E6A'
    },
    recordAmountContainer: {
        alignItems: 'flex-end',
    },
    recordAmount: {
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
    }
});

export default RecordList;