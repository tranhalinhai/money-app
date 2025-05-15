import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import SignUp from "./screens/SignUp";
import Login from "./screens/Login";
import Homepage from "./screens/Homepage";
import Records from "./screens/Records";
import Budget from "./screens/Budget";
import AddBudget from "./components/AddBudget";
import Profile from "./screens/Profile";
import AddTransaction from './screens/AddTransaction';
import InformationFix from './components/InformationFix';
import BudgetDetail from "./components/BudgetDetail";
import EditBudget from "./components/EditBudget";

import { NavigationBar } from './navigation/NavigationBar';

const Stack = createNativeStackNavigator();

export default function App() {
  const [activeScreen, setActiveScreen] = useState(null);

  const handleScreenChange = (screen) => {
    setActiveScreen(screen);
  };

  const handleSplashDone = () => {
    setActiveScreen('Homepage');
  };

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={() => <SplashScreen onSplashDone={handleSplashDone} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Homepage"
            children={() => <Homepage onScreenChange={handleScreenChange} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Records"
            children={() => <Records onScreenChange={handleScreenChange} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Budget"
            children={() => <Budget onScreenChange={handleScreenChange} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BudgetDetail" // Registering BudgetDetail
            component={BudgetDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
                      name="EditBudget" // Registering BudgetDetail
                      component={EditBudget}
                      options={{ headerShown: false }}
          />
          <Stack.Screen
                                name="AddBudget" // Registering BudgetDetail
                                component={AddBudget}
                                options={{ headerShown: false }}
                    />

          <Stack.Screen
            name="Profile"
            children={() => <Profile onScreenChange={handleScreenChange} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTransaction"
            children={() => <AddTransaction onScreenChange={handleScreenChange} />}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="InformationFix"
            children={() => <InformationFix onScreenChange={handleScreenChange} />}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>

        {activeScreen && ['Homepage', 'Records', 'Budget', 'Profile', 'AddTransaction'].includes(activeScreen) && (
          <View style={styles.navigationContainer}>
            <NavigationBar activeScreen={activeScreen} onScreenChange={setActiveScreen} />
          </View>
        )}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
