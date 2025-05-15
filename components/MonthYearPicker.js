import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface MonthYearPickerProps {
  initialDate?: Date;
  onDateChange: (date: Date) => void;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ initialDate, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const handleSelectDate = () => {
    setDatePickerVisible(true);
  };

  const handleDateConfirm = (date: Date) => {
    setCurrentDate(date);
    onDateChange(date);
    setDatePickerVisible(false);
  };

  const handleDateCancel = () => {
    setDatePickerVisible(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentDay = currentDate.getDate();
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowButton} onPress={handlePrevMonth}>
          <Ionicons name="chevron-back" size={wp('6%')} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {currentDay} {currentMonth}, {currentYear}
        </Text>
        <TouchableOpacity style={styles.arrowButton} onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={wp('6%')} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.calendarButton} onPress={handleSelectDate}>
          <Ionicons name="calendar-outline" size={wp('6%')} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#39998E',
    borderRadius: wp('2%'),
    padding: hp('1%'),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  arrowButton: {
    padding: wp('3%'),
  },
  dateText: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#ffffff',
  },
  calendarButton: {
    padding: wp('3%'),
  },
});

export default MonthYearPicker;