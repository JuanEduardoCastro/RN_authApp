import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import HomeScreen from '@screens/home/HomeScreen';
import { RootStackParamList } from './types';
import { useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthorized } = useAppSelector(userAuth);
  return (
    <Stack.Navigator
      initialRouteName={isAuthorized ? 'HomeScreen' : 'AuthNavigator'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
