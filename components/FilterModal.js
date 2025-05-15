import React, { useRef, useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, PanResponder } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const FilterModal = ({ isVisible, onClose, selectedFilters: initialSelectedFilters, onFilterSelect, selectedSort: initialSelectedSort, onSortSelect, onApplyFilter, onSelectionChange }) => {
    const modalPositionY = useRef(new Animated.Value(0)).current;
    const [localSelectedFilters, setLocalSelectedFilters] = useState(initialSelectedFilters);
    const [localSelectedSort, setLocalSelectedSort] = useState(initialSelectedSort);
    const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderMove: (_, gestureState) => {
            modalPositionY.setValue(gestureState.dy);
          },
          onPanResponderRelease: (_, gestureState) => {
              if (gestureState.dy > 50) {
                  onClose();
              } else {
                Animated.spring(modalPositionY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
              }
          },
            onPanResponderTerminate: (_, gestureState) => {
                  if (gestureState.dy > 50) {
                      onClose();
                  } else {
                    Animated.spring(modalPositionY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                  }
            },
        })
    ).current;

    useEffect(() => {
        setLocalSelectedFilters(initialSelectedFilters);
        setLocalSelectedSort(initialSelectedSort);
    }, [initialSelectedFilters, initialSelectedSort]);

   const handleFilterSelect = (filter) => {
        setLocalSelectedFilters(filter);
    };

    const handleSortSelect = (sort) => {
        setLocalSelectedSort(sort);
     };

    const handleApply = () => {
       onApplyFilter(localSelectedFilters, localSelectedSort);
       onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
               <Animated.View style={[styles.modalContent, { transform: [{ translateY: modalPositionY }] }]} {...panResponder.panHandlers}>
               <View style={styles.dragHandle}></View>

            <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter transaction</Text>
                <TouchableOpacity onPress={() => {
                    setLocalSelectedFilters('');
                    setLocalSelectedSort('');
                }} style={styles.resetButton}>
                  <Text style={{fontSize: wp('4%'), color: '#2B4D59', fontWeight: 'bold'}}>Reset</Text>
               </TouchableOpacity>
            </View>

            <Text style={styles.filterOption}>Filter by</Text>
            <View style={styles.filterButtonContainer}>
                <TouchableOpacity style={[styles.filterButtonItem, localSelectedFilters === 'expense' && styles.filterButtonActive]} onPress={() => handleFilterSelect('expense')}>
                    <Text style={{fontSize: wp('4%')}}>Expenses</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterButtonItem, localSelectedFilters === 'income' && styles.filterButtonActive]} onPress={() => handleFilterSelect('income')}>
                    <Text style={{fontSize: wp('4%')}}>Income</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.filterOption}>Sort by</Text>
            <View style={styles.sortButtonContainer}>
                <TouchableOpacity style={[styles.sortButtonItem, localSelectedSort === 'Highest' && styles.filterButtonActive]} onPress={() => handleSortSelect('Highest')}>
                    <Text style={{fontSize: wp('4%')}}>Highest</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.sortButtonItem, localSelectedSort === 'Lowest' && styles.filterButtonActive]} onPress={() => handleSortSelect('Lowest')}>
                    <Text style={{fontSize: wp('4%')}}>Lowest</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
                <Text style={{fontSize: wp('4%'), color: 'black', fontWeight: 'bold'}}>Apply</Text>
            </TouchableOpacity>
        </Animated.View>
       </View>
     </Modal>
  );
  }

  const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },

      modalContent: {
        backgroundColor: '#39998E',
        padding: wp('5%'),
        borderTopLeftRadius: wp('10%'),
        borderTopRightRadius: wp('10%'),
        width: wp('100%'),
      },

      dragHandle: {
        height: hp('0.5%'),
        width: wp('15%'),
        backgroundColor: '#fff',
        borderRadius: wp('1%'),
        alignSelf: 'center',
        marginTop: hp('0%'),
        marginBottom: hp('2%'),
      },

      modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },

      modalTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        color: '#fff',
      },

      resetButton: {
        backgroundColor: '#FDD773',
        paddingTop: wp('1.5%'),
        paddingBottom: wp('1.5%'),
        paddingLeft: wp('5%'),
        paddingRight: wp('5%'),
        borderRadius: wp('5%'),
        },

      filterOption: {
          fontSize: wp('4%'),
          fontWeight: 'bold',
          marginTop: hp('1.5%'),
          marginBottom: hp('1%'),
          color: '#fff',
      },

      modalOption: {
        paddingVertical: hp('1%'),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginTop: hp('1%')
      },

      filterButtonContainer: {
        flexDirection: 'row',
        marginTop: hp('1%'),
        gap: wp('3%'),
       },

      filterButtonItem: {
        backgroundColor: '#FFECBB',
        paddingTop: wp('1.5%'),
        paddingBottom: wp('1.5%'),
        paddingLeft: wp('5%'),
        paddingRight: wp('5%'),
        borderRadius: wp('5%'),
      },

      sortButtonContainer: {
        flexDirection: 'row',
        marginTop: hp('1%'),
        flexWrap: 'wrap',
        gap: wp('3%'),
      },

      sortButtonItem: {
        backgroundColor: '#FFECBB',
        paddingTop: wp('1.5%'),
        paddingBottom: wp('1.5%'),
        paddingLeft: wp('5%'),
        paddingRight: wp('5%'),
        borderRadius: wp('5%'),
        marginBottom: hp('1%'),
      },

      applyButton: {
        backgroundColor: '#FDD773',
        padding: wp('3%'),
        borderRadius: wp('2%'),
        marginTop: hp('3%'),
        alignItems: 'center'
      },

       filterButtonActive: {
        backgroundColor: '#DA674A',
      },

      });

export default FilterModal;