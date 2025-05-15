import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Keyboard } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const Calculator = ({ onResultChange }) => {
    const [input, setInput] = useState("");

    const onButtonPress = (value) => {
        if (value === "=") {
            try {
                const computedResult = eval(input.replace("x", "*"));
                setInput(String(computedResult));
                onResultChange(String(computedResult));
            } catch (error) {
                console.error(error);
                setInput("error");
                onResultChange("error");
            }
        } else if (value === "AC") {
            setInput("");
            onResultChange("");
        } else {
            const updatedInput = input + value;
            setInput(updatedInput);
            onResultChange(updatedInput); // Cập nhật ngay khi nhập
        }
    };

    const handleTextChange = (text) => {
        setInput(text);
        onResultChange(text); // Cập nhật ngay khi thay đổi giá trị
    };

    const handleBlur = () => {
        Keyboard.dismiss();
    };

    return (
        <View>
            <TextInput
                style={styles.inputText}
                value={input}
                onChangeText={handleTextChange}
                keyboardType="number-pad"
                placeholder="Enter numbers"
                editable={true}
                returnKeyType="done"
                onSubmitEditing={handleBlur}
                onBlur={handleBlur}
                blurOnSubmit={true}
            />
            <View style={styles.buttonContainer}>
                {["7", "8", "9", "x", "4", "5", "6", "-", "1", "2", "3", "+", "0", "AC", "=", "/"].map(
                    (item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.button}
                            onPress={() => onButtonPress(item)}
                        >
                            <Text style={styles.buttonText}>{item}</Text>
                        </TouchableOpacity>
                    )
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputText: {
        fontSize: wp("8%"),
        marginBottom: hp("2%"),
        backgroundColor: "#FFF",
        padding: hp("2%"),
        borderRadius: wp("4%"),
        textAlign: "right",
        borderColor: "#FFAA67",
        borderWidth: 4,
    },
    buttonContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: hp("-1.5%"),
    },
    button: {
        fontSize: wp("6%"),
        width: wp("20%"),
        alignItems: "center",
        padding: hp("2%"),
        borderRadius: wp("2%"),
        marginVertical: hp("1%"),
        backgroundColor: "#FFAA67",
    },
    buttonText: {
        fontSize: wp("6%"),
    },
});

export default Calculator;