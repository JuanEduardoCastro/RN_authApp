import React, { useEffect, useMemo } from 'react';

import { Platform } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { userAdmin } from '@store/adminSlice';
import { useAppSelector } from '@store/hooks';

import HomeScreen from '@screens/home/HomeScreen';
import InboxScreen from '@screens/home/InboxScreen';

import { useBadgeCount } from '@hooks/useBadgeCount';
import { useMode } from '@context/ModeContext';

import { EnvelopIcon, HomeIcon, SettingsIcon } from '@assets/svg/icons';

import { SCREEN } from '@constants/dimensions';

import SettingsNavigator from './SettingsNavigation';
import { HomeTabParamList } from './types';

const Tab = createBottomTabNavigator<HomeTabParamList>();

const HomeNavigation = () => {
  const { colors } = useMode();
  const { unreadCount } = useAppSelector(userAdmin);
  const { syncBadge } = useBadgeCount();

  useEffect(() => {
    const interval = setInterval(syncBadge, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabBarStyle = useMemo(
    () => ({
      elevation: 0,
      paddingTop: 8,
      paddingLeft: 16,
      paddingRight: 16,
      height:
        Platform.OS === 'ios'
          ? SCREEN.heightFixed * 80
          : SCREEN.heightFixed * 60,
      backgroundColor: colors.tabBackground,
      shadowColor: '#101014',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.19,
      shadowRadius: 10,
      position: 'absolute' as const,
      bottom: Platform.OS === 'ios' ? 0 : 8,
    }),
    [colors.tabBackground],
  );

  return (
    <Tab.Navigator
      // initialRouteName={'ProfileScreen'}
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle,
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case 'HomeScreen':
              return (
                <HomeIcon
                  width={25}
                  height={25}
                  color={focused ? colors.second : colors.text}
                />
              );
            case 'InboxScreen':
              return (
                <EnvelopIcon
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
              return null;
          }
        },
      })}>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen
        name="InboxScreen"
        component={InboxScreen}
        options={{ tabBarBadge: unreadCount > 0 ? unreadCount : undefined }}
      />
      <Tab.Screen name="SettingsNavigator" component={SettingsNavigator} />
    </Tab.Navigator>
  );
};

export default HomeNavigation;
