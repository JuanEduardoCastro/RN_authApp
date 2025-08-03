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
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name={'WelcomeScreen'}
        component={WelcomeScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={'LoginScreen'}
        component={LoginScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name={'CheckEmailScreen'}
        component={CheckEmailScreen}
        options={{ gestureEnabled: false }}
      />

      <Stack.Screen
        name={'NewPasswordScreen'}
        component={NewPasswordScreen}
        initialParams={{ emailToken: null }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
