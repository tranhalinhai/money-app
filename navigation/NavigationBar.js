import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface NavBarProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

type ScreenName = 'Homepage' | 'Records' | 'Budget' | 'Profile';

const NavigationBar: React.FC<NavBarProps> = ({ activeScreen, onScreenChange }) => {
  const navigation = useNavigation();
  const currentRouteName = useNavigationState(
    (state) => state.routes[state.index]?.name
  );

if (currentRouteName === 'AddBudget'
  || currentRouteName === 'AddTransaction'||
  currentRouteName === 'BudgetDetail'
  ||currentRouteName === 'EditBudget'
  ||currentRouteName === 'DetailTransaction'
  || currentRouteName === 'SplashScreen'
  || currentRouteName === 'Login'
  || currentRouteName === 'InformationFix') {
    return null;
  }

  const handlePress = (screen: ScreenName) => {
    navigation.navigate(screen);
    onScreenChange(screen);
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('Homepage')}
      >
        <Ionicons
          name="home"
          size={wp('6%')}
          color={activeScreen === 'Homepage' ? '#ff8c42' : '#ffffff'}
        />
        <Text
          style={[
            styles.navText,
            { color: activeScreen === 'Homepage' ? '#ff8c42' : '#ffffff' },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('Records')}
      >
        <Ionicons
          name="stats-chart"
          size={wp('6%')}
          color={activeScreen === 'Records' ? '#ff8c42' : '#ffffff'}
        />
        <Text
          style={[
            styles.navText,
            { color: activeScreen === 'Records' ? '#ff8c42' : '#ffffff' },
          ]}
        >
          Records
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => handlePress('AddTransaction')}
        
      >
        <Ionicons name="add" 
        size={wp('10%')} 
        color={activeScreen === 'AddTransaction' ? '#ff8c42' : '#ffffff'} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('Budget')}
      >
        <Ionicons
          name="wallet"
          size={wp('6%')}
          color={activeScreen === 'Budget' ? '#ff8c42' : '#ffffff'}
        />
        <Text
          style={[
            styles.navText,
            { color: activeScreen === 'Budget' ? '#ff8c42' : '#ffffff' },
          ]}
        >
          Budget
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handlePress('Profile')}
      >
        <Ionicons
          name="person-circle"
          size={wp('6%')}
          color={activeScreen === 'Profile' ? '#ff8c42' : '#ffffff'}
        />
        <Text
          style={[
            styles.navText,
            { color: activeScreen === 'Profile' ? '#ff8c42' : '#ffffff' },
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2B4D59',
    height: hp('11%'),
    width: wp('100%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    color: '#ffffff',
    fontSize: hp('1.5%'),
    marginTop: 5,
  },
  centerButton: {
    bottom: hp('5.5%'),
    backgroundColor: '#FDD773',
    width: wp('17%'),
    height: wp('17%'),
    borderRadius: wp('17%') / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
    borderWidth: 4,
    borderColor: '#2B4D59',
  },
});

export { NavigationBar };