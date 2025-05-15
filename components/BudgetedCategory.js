import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const BudgetedCategory = ({
    category,
    amount,
    spent,
    startDate,
    endDate,
    icon,
    handleAddBudget,
    id
}) => {
    const navigation = useNavigation();
    const remaining = amount - spent;
    const exceeded = remaining < 0;

    const handleCategoryPress = () => {
        navigation.navigate('BudgetDetail', {
            budgetId: id,
            category,
            amount,
            spent,
            startDate,
            endDate,
            icon
        });
    };

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity
                style={[styles.container, exceeded && styles.exceeded]}
                onPress={handleCategoryPress}
            >
                <View style={styles.header}>
                    <Ionicons name={icon} size={wp("7%")} color="#000" style={styles.icon} />
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.amount}>{amount} đ</Text>
                </View>
                <View style={styles.details}>
                    <Text style={styles.remaining}>
                        Remaining: {remaining.toLocaleString()} đ
                    </Text>
                    <View style={[styles.progressBar, exceeded ? styles.exceededBar : styles.remainingBar]}>
                        <View
                            style={{
                                ...styles.progressFill,
                                width: `${(spent / amount) * 100}%`,
                                backgroundColor: exceeded ? "red" : "#FFAA67",
                            }}
                        />
                    </View>
                    <Text style={styles.spent}>
                        Spent: {spent.toLocaleString()} đ
                    </Text>
                    <Text style={styles.dates}>
                        {startDate} - {endDate}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Button outside of the main container */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddBudget}
            >
                <Text style={styles.addButtonText}>Add a budget</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: wp('90%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
    },
    container: {
        backgroundColor: "#FFF",
        borderRadius: wp("2%"),
        padding: wp("4%"),
        borderWidth: 2,
        borderColor: "#FFAA67",
        marginBottom: hp('4%'),
        top: hp('3%'),
    },
    exceeded: {
        borderColor: "red",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    icon: {
        width: wp('12%'),
        height: wp('12%'),
        backgroundColor: '#FDD773',
        borderRadius: wp('2%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('3%'),
    },
    categoryName: {
        fontSize: wp("5%"),
        fontWeight: "bold",
    },
    amount: {
        fontSize: wp("4%"),
    },
    details: {
        marginTop: hp("1%"),
    },
    remaining: {
        fontSize: wp("4%"),
        marginBottom: hp("1%"),
    },
    progressBar: {
        height: hp("1%"),
        borderRadius: hp("0.5%"),
        overflow: "hidden",
        marginBottom: hp("1%"),
    },
    remainingBar: {
        backgroundColor: "#E0E0E0",
    },
    exceededBar: {
        backgroundColor: "#FFDAD9",
    },
    progressFill: {
        height: "100%",
    },
    spent: {
        fontSize: wp("4%"),
    },
    dates: {
        fontSize: wp("3.5%"),
        color: "#7D7D7D",
    },
    addButton: {
        backgroundColor: '#FDD773',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('10%'),
        borderRadius: hp('1%'),
        alignItems: 'center',
        marginTop: hp('32%'),
        marginBottom: hp('3%'),
    },
    addButtonText: {
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
        color: '#2B4D59',
    },
});

export default BudgetedCategory;