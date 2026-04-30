import React from 'react';

import { Platform } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '@screens/home/HomeScreen';

import { useMode } from '@context/ModeContext';

import { HomeIcon, SettingsIcon } from '@assets/svg/icons';

import { SCREEN } from '@constants/dimensions';

import SettingsNavigator from './SettingsNavigation';
import { HomeTabParamList } from './types';

const Tab = createBottomTabNavigator<HomeTabParamList>();

const HomeNavigation = () => {
  const { colors } = useMode();

  return (
    <Tab.Navigator
      // initialRouteName={'ProfileScreen'}
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          elevation: 0,
          paddingTop: 8,
          height:
            Platform.OS === 'ios'
              ? SCREEN.heightFixed * 80
              : SCREEN.heightFixed * 60,
          backgroundColor: colors.tabBackground,
          shadowColor: '#101014',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.19,
          shadowRadius: 10,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 0 : 8,
        },

        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case 'HomeScreen':
              return (
                <HomeIcon
                  width={26}
                  height={26}
                  color={focused ? colors.second : colors.text}
                />
              );
            case 'SettingsNavigator':
              return (
                <SettingsIcon
                  width={28}
                  height={28}
                  color={focused ? colors.second : colors.text}
                />
              );
            default:
              break;
          }
        },
      })}>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="SettingsNavigator" component={SettingsNavigator} />
    </Tab.Navigator>
  );
};

export default HomeNavigation;
