import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CameraPicker = ({ onPickImage }) => {//onPickImage: Là một props dùng để truyền đường dẫn hình ảnh đã chọn hoặc chụp lên
    const [selectedImage, setSelectedImage] = useState(null);

    // Hàm xử lý chọn hình từ thư viện
    const pickImageHandler = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            // phương thức của expo-image-picker cho phép mở thư viện ảnh của điện thoại để người dùng chọn một bức ảnh
            allowsEditing: true,//Cho phép chỉnh sửa ảnh (cắt xén)
            aspect: [16, 9],//Tỷ lệ khung hình của ảnh
            quality: 0.5,// Chất lượng của ảnh (0.5 là độ phân giải trung bình)
        });

        if (!result.canceled) {
            //Sau khi người dùng chọn ảnh, result.assets[0].uri sẽ chứa đường dẫn của ảnh được chọn.
            setSelectedImage(result.assets[0].uri);
            onPickImage(result.assets[0].uri);
        }
    };

    // Hàm xử lý chụp ảnh bằng camera
    const takePhotoHandler = async () => {
        // Kiểm tra và yêu cầu quyền truy cập camera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access camera is required!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            onPickImage(result.assets[0].uri);
        }
    };


    return (
        <View style={styles.imagePickerContainer}>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={pickImageHandler}>
                    <Text style={styles.buttonText}>Pick Image</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={takePhotoHandler}>
                    <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    imagePickerContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    imagePreview: {
        width: 340,
        height: 200,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#007BFF',
        borderRadius: 10,
        backgroundColor: '#e0f7fa',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#FDD773',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CameraPicker;