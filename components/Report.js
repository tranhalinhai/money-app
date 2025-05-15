import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TransactionHeader from './TransactionHeader';
import TimeDropdown from './TimeDropdown';
import RecordList from './RecordList';
import PieChart from './PieChart';

const Report = () => {
    const [transactions, setTransactions] = useState([]);
    const [categoryType, setCategoryType] = useState('expense');
    const [timeStates, setTimeStates] = useState({
        expense: { isTimeDropdownVisible: false, selectedTime: 'Week' },
        income: { isTimeDropdownVisible: false, selectedTime: 'Week' },
    });
    const [sortOption, setSortOption] = useState('');
    const [selectedCategoryTypes, setSelectedCategoryTypes] = useState(['expense']);
    const [chartData, setChartData] = useState([]);

     const handleTransactionsChange = useCallback((newTransactions) => {
        setTransactions(newTransactions);
     }, []);


     useEffect(() => {
        console.log("Report: useEffect triggered - sort:", sortOption, "selectedCategoryTypes:", selectedCategoryTypes, "selectedTime:", timeStates[categoryType].selectedTime);
        // Prepare chart data
        if (!transactions) {
            return;
        }
        let tempTransactions = [...transactions];
        console.log("Report: tempTransactions before filter:", tempTransactions);

         if (selectedCategoryTypes && selectedCategoryTypes.length > 0) {
            console.log("Report: Category filter applied", selectedCategoryTypes);
            tempTransactions = tempTransactions.filter(transaction =>
                selectedCategoryTypes.includes(transaction.type)
            );
        }


        //Time Filtering
        const selectedTime = timeStates[categoryType].selectedTime;
        if(selectedTime === 'Day') {
                console.log("Report: Day filter applied")
               tempTransactions = tempTransactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    const today = new Date();
                    return (
                       transactionDate.getDate() === today.getDate() &&
                       transactionDate.getMonth() === today.getMonth() &&
                       transactionDate.getFullYear() === today.getFullYear()
                   );
               })
           }else if(selectedTime === 'Week') {
                console.log("Report: Week filter applied")
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
                console.log("Report: Month filter applied")
                tempTransactions = tempTransactions.filter(transaction => {
                   const transactionDate = new Date(transaction.date);
                   const today = new Date();

                    return (
                     transactionDate.getMonth() === today.getMonth() &&
                      transactionDate.getFullYear() === today.getFullYear()
                    );
               });
            } else if (selectedTime === 'Year') {
               console.log("Report: Year filter applied")
                tempTransactions = tempTransactions.filter(transaction => {
                  const transactionDate = new Date(transaction.date);
                  const today = new Date();
                  return (
                    transactionDate.getFullYear() === today.getFullYear()
                  )
                })
          }
            console.log("Report: tempTransactions after time filter:", tempTransactions);

        if (sortOption) {
            console.log("Report: Sort is applied", sortOption);
            tempTransactions.sort((a, b) => {
                if (sortOption === 'Highest') {
                    return b.amount - a.amount;
                }
                if (sortOption === 'Lowest') {
                    return a.amount - b.amount;
                }
                return 0;
            });
        }

        console.log("Report: tempTransactions after sort:", tempTransactions);

        const categoryTotals = tempTransactions.reduce((acc, transaction) => {
            const category = transaction.name;
            if (acc[category]) {
                acc[category] += transaction.amount;
            } else {
                acc[category] = transaction.amount;
            }
            return acc;
        }, {});


        const generateColors = (numCategories, type) => {
            const colors = [];
             const hueStart = type === 'expense' ? 0 : 180;
             const hueStep = 180 / numCategories;
             for (let i = 0; i < numCategories; i++) {
                const hue = (hueStart + i * hueStep) % 360;
                const saturation = type === 'expense' ? 100 : 70; // Adjust saturation for difference
               const lightness = type === 'expense' ? 50 : 60
              const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                 colors.push(color);
             }
           return colors;
            };


        const newChartData = Object.keys(categoryTotals).map((category, index) => {
           const transaction = tempTransactions.find(trans => trans.name === category);
            const isExpense = transaction?.type === 'expense';
            const type = isExpense ? 'expense' : 'income';
            const colors = generateColors(Object.keys(categoryTotals).length, type);
          return  {
                name: category,
               value: categoryTotals[category],
               color: colors[index]
           }
        });
        console.log("Report: Chart data:", newChartData);
        setChartData(newChartData);

    }, [transactions, sortOption, selectedCategoryTypes, timeStates, categoryType]);

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

    const handleSortSelect = (sort) => {
        setSortOption(sort);
    }


      const handleCategoryChange = (type) => {
        setSelectedCategoryTypes(prevTypes => {
            if (prevTypes.includes(type)) {
               return prevTypes.filter(item => item !== type)
            } else {
                return [type]
            }
        });

        setCategoryType(type); // Keep categoryType updated for header and other components
    };

    const renderContent = () => {
        const { isTimeDropdownVisible, selectedTime } = timeStates[categoryType];

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <TransactionHeader
                        selectedTime={selectedTime}
                        onTimePress={() => handleTimePress(categoryType)}
                        activeTab={categoryType}

                    />
                </View>
                <TimeDropdown
                    isVisible={isTimeDropdownVisible}
                    onTimeSelect={(time) => handleTimeSelect(categoryType, time)}
                />

                <View style={[styles.chartContainer]}>
                    <PieChart data={chartData} />
                </View>

                <View style={styles.tabBar}>
                    <TouchableOpacity
                        onPress={() => handleCategoryChange('expense')}
                        style={[
                            styles.tabButton,
                            categoryType === 'expense' ? styles.activeTabExpenses : null,
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            categoryType === 'expense' ? styles.activeTabText : null,
                        ]}>Expenses</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleCategoryChange('income')}
                        style={[
                            styles.tabButton,
                            categoryType === 'income' ? styles.activeTabIncome : null,
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            categoryType === 'income' ? styles.activeTabText : null,
                        ]}>Income</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.recordListContainer}>
                    <RecordList
                       onTransactionsChange={handleTransactionsChange}
                       selectedCategoryTypes={selectedCategoryTypes}
                       sort={sortOption}
                       selectedTime = {selectedTime}
                    />
                </View>

            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderContent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        flexDirection: 'row',
        marginBottom: hp('2%'),
        marginTop: hp('1%'),
        justifyContent: 'center',
        width: wp('90%'),
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
    },
    tabButton: {
        flex: 1,
        paddingVertical: hp('1.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'gray',
    },
    activeTabText: {
        color: 'black',
    },
    activeTabExpenses: {
        backgroundColor: '#FDD773',
    },
    activeTabIncome: {
        backgroundColor: '#27E5CF',
    },
    header: {
        alignItems: 'flex-start',
        marginBottom: hp('2%'),
        flexDirection: 'row',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('6%'),
        marginTop: hp('4%')
    },
    recordListContainer: {
        flex: 1,
    },
});

export default Report;