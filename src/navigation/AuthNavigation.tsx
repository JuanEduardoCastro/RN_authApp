import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '@screens/auth/WelcomeScreen';
import LoginScreen from '@screens/auth/LoginScreen';
import CheckEmailScreen from '@screens/auth/CheckEmailScreen';
import NewPasswordScreen from '@screens/auth/NewPasswordScreen';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
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
        initialParams={{ emailToken: null }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
