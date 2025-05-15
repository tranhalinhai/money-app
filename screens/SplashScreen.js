import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function SplashScreen() {
  const navigation = useNavigation(); 

  
  const appNameOpacity = useRef(new Animated.Value(1)).current;
  const image1TranslateX = useRef(new Animated.Value(360)).current;
  const image2TranslateX = useRef(new Animated.Value(360)).current;
  const image3TranslateX = useRef(new Animated.Value(360)).current;

  const button1Color = useRef(new Animated.Value(0)).current;
  const button2Color = useRef(new Animated.Value(0)).current;
  const button3Color = useRef(new Animated.Value(0)).current;

  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonContainerOpacity = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.sequence([
      Animated.timing(appNameOpacity, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(image1TranslateX, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonContainerOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(button1Color, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(image2TranslateX, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(button2Color, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(button1Color, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
      Animated.timing(image3TranslateX, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(button3Color, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(button2Color, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, []);
  

  const interpolateButton1Color = button1Color.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FDD773', '#DA674A'],
  });
  const interpolateButton2Color = button2Color.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FDD773', '#DA674A'],
  });
  const interpolateButton3Color = button3Color.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FDD773', '#DA674A'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.appNameContainer, { opacity: appNameOpacity }]}>
        <Text style={styles.textMoneki}>moneki</Text>
      </Animated.View>

      <Animated.View style={[styles.splashScreen, { transform: [{ translateX: image1TranslateX }] }]}>
        <Image source={require('../assets/images/1.png')} style={styles.image} />
      </Animated.View>

      <Animated.View style={[styles.splashScreen, { transform: [{ translateX: image2TranslateX }] }]}>
        <Image source={require('../assets/images/2.png')} style={styles.image} />
      </Animated.View>

      <Animated.View style={[styles.splashScreen, { transform: [{ translateX: image3TranslateX }] }]}>
        <Image source={require('../assets/images/3.png')} style={styles.image} />
      </Animated.View>

      <Animated.View style={[styles.dotsContainer, { opacity: buttonOpacity }]}>
        <Animated.View style={[styles.dot, { backgroundColor: interpolateButton1Color }]} />
        <Animated.View style={[styles.dot, { backgroundColor: interpolateButton2Color }]} />
        <Animated.View style={[styles.dot, { backgroundColor: interpolateButton3Color }]} />
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, { opacity: buttonContainerOpacity }]}>
          <TouchableOpacity
            style={[styles.buttonSignUp]}
            onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonLogin]}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
      </Animated.View>    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appNameContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textMoneki: {
    fontSize: hp('8%'),
    color: '#39998E',
    fontWeight: 'bold',
    fontFamily: 'Comfy Feeling',
    marginTop: hp('40%'),
  },
  splashScreen: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: hp('20%'), 
  },
  image: {
    bottom: hp('12.5%'), 
    width: wp('90%'), 
    height: hp('65.25%'),
    resizeMode: 'contain',
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: wp('100%'), 
    paddingHorizontal: wp('5.5%'), 
    marginTop: 'auto',
    top: hp('5%'), 
    gap: hp('4%'), 
  },
  buttonLogin: {
    backgroundColor: '#FFECBB',
    width: wp('90%'), 
    height: hp('6.5%'), 
    paddingVertical: hp('2%'), 
    paddingHorizontal: wp('27.5%'), 
    borderRadius: hp('1.25%'), 
    bottom: hp('9%'), 
  },
  buttonSignUp: {
    backgroundColor: '#FDD773',
    width: wp('90%'),
    height: hp('6.5%'),
    paddingVertical: hp('2%'), 
    paddingHorizontal: wp('27.5%'), 
    borderRadius: hp('1.25%'),

  },
  buttonText: {
    color: 'black',
    fontSize: hp('2%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    top: hp('23%'),
    
  },
  dot: {
    width: hp('2%'), 
    height: hp('2%'), 
    borderRadius: hp('50%'), 
    marginHorizontal: wp('1.25%'),
    
  },
});
