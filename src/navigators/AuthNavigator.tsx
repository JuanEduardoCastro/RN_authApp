import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '@screens/auth/WelcomeScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import CheckEmailScreen from '@screens/auth/CheckEmailScreen';
import { AuthStackParamList } from './types';
import NewPasswordScreen from '@screens/auth/NewPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      // initialRouteName="Login screen"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name={'WelcomeScreen'} component={WelcomeScreen} />
      <Stack.Screen name={'LoginScreen'} component={LoginScreen} />
      <Stack.Screen name={'CheckEmailScreen'} component={CheckEmailScreen} />

      <Stack.Screen
        name={'NewPasswordScreen'}
        component={NewPasswordScreen}
        initialParams={{ token: null }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
