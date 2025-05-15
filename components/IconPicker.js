import React, { useState } from 'react';
import { View, ScrollView,TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import từ @expo/vector-icons

const IconPicker = ({ onSelectIcon, selectedIcon, label, icons, isVisible }) => {


    const handleIconClick = (iconName) => {
      onSelectIcon(iconName);
    };

    if (!isVisible) { // Don't render if not visible
        return null;
     }

     return (
        <View style={styles.container}>
            {label && <Text>{label}</Text>} {/* Only show label if provided */}
            <View style={styles.iconList}>
                {icons.map((iconName) => (
                    <TouchableOpacity key={iconName} style={styles.iconItem} onPress={() => handleIconClick(iconName)}>
                        <Ionicons name={iconName} size={24} color="black" />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    selectedIcon: {

    },
    iconBackground: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconList: {
      position: 'absolute',
      top: '100%',
      left: 0,
      backgroundColor: 'white',
      borderColor: '#ccc',
      borderWidth: 1,
      zIndex: 10,
      padding: 8,
      width: '100%', // Đảm bảo list icon chiếm toàn bộ chiều rộng
      flexDirection: 'row', // Sắp xếp icon theo hàng ngang
      flexWrap: 'wrap', // Cho phép icon xuống dòng khi hết chỗ
    },

    iconItem: {
      padding: 8,
    },

  });

export default IconPicker;