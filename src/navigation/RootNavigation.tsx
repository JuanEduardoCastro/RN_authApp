import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigation';
import HomeNavigator from './HomeNavigation';
import { RootStackParamList } from './types';
import { userAuth } from 'src/store/authSlice';
import { useAppSelector } from '@store/hooks';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  const { isAuthorized } = useAppSelector(userAuth);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      {isAuthorized ? (
        <Stack.Screen
          name="HomeNavigator"
          component={HomeNavigator}
          options={{ gestureEnabled: false }}
        />
      ) : (
        <Stack.Screen
          name="AuthNavigator"
          component={AuthNavigator}
          options={{ gestureEnabled: false, animation: 'none' }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;
