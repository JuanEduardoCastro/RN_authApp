import { View, Text, StyleSheet, Platform } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@screens/home/HomeScreen';
import { HomeTabParamList } from './types';
import { HomeIcon, ProfileIcon, SettingsIcon } from '@assets/svg/icons';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import ProfileScreen from '@screens/home/ProfileScreen';
import SettingsScreen from '@screens/home/SettingsScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<HomeTabParamList>();

const HomeNavigator = () => {
  const { colors, styles } = useStyles(createStyles);
  const inset = useSafeAreaInsets();

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
          height: Platform.OS === 'ios' ? 80 : 60,
          backgroundColor: colors.tabBackground,
          shadowColor: '#101014',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.19,
          shadowRadius: 10,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 0 : inset.bottom,
        },

        tabBarIcon: ({ size, focused, color }) => {
          switch (route.name) {
            case 'HomeScreen':
              return (
                <HomeIcon
                  width={26}
                  height={26}
                  color={focused ? colors.second : colors.text}
                />
              );

            case 'ProfileScreen':
              return (
                <ProfileIcon
                  width={28}
                  height={28}
                  color={focused ? colors.second : colors.text}
                />
              );
            case 'SettingsScreen':
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
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default HomeNavigator;

const createStyles = (colors: TColors) => StyleSheet.create({});
