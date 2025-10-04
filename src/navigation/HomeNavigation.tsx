import { StyleSheet, Platform } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsNavigator from './SettingsNavigation';
import HomeScreen from '@screens/home/HomeScreen';
import { HomeTabParamList } from './types';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import { HomeIcon, SettingsIcon } from '@assets/svg/icons';
import useStyles from '@hooks/useStyles';

const Tab = createBottomTabNavigator<HomeTabParamList>();

const HomeNavigation = () => {
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

const createStyles = (colors: TColors) => StyleSheet.create({});
