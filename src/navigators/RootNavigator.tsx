import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import { RootStackParamList } from './types';
import { useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';
import HomeNavigator from './HomeNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthorized, user } = useAppSelector(userAuth);

  return (
    <Stack.Navigator
      initialRouteName={
        !user && isAuthorized ? 'HomeNavigator' : 'AuthNavigator'
      }
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name="AuthNavigator"
        component={AuthNavigator}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
