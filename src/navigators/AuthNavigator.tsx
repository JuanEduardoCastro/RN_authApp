import { View, Text } from 'react-native';
import React from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '@screens/auth/WelcomeScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import SigninScreen from '@screens/auth/SigninScreen';
import CheckEmailScreen from '@screens/auth/CheckEmailScreen';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      // initialRouteName="Login screen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={'WelcomeScreen'} component={WelcomeScreen} />
      <Stack.Screen name={'LoginScreen'} component={LoginScreen} />
      <Stack.Screen name={'CheckEmailScreen'} component={CheckEmailScreen} />

      <Stack.Screen name={'SigninScreen'} component={SigninScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
