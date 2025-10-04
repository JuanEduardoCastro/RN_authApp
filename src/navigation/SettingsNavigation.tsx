import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '@screens/settings/ProfileScreen';
import SettingsScreen from '@screens/settings/SettingsScreen';
import { SettingsParamList } from './types';

const Stack = createNativeStackNavigator<SettingsParamList>();

const SettingsNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigation;
