// DatePicker.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const DatePicker = ({ date, setDate, isVisible, setIsVisible }) => {
  const showDatePicker = () => setIsVisible(true);
  const hideDatePicker = () => setIsVisible(false);

  const handleDateConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  return (
    <>
      <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
        <Text style={styles.datePick}>{date.toDateString()}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dateButton:{
    backgroundColor: "#FDD773",
    padding: hp("2%"),
    borderRadius: wp("2%"),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default DatePicker;
