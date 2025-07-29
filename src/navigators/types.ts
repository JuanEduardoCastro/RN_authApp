/* types for navigators */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace RootNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  AuthNavigator: NavigatorScreenParams<AuthStackParamList>;
  HomeNavigator: NavigatorScreenParams<HomeTabParamList>;
};

export type AuthStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  CheckEmailScreen: { checkMode: 'new_password' | 'reset_password' };
  NewPasswordScreen: { emailToken: string | null };
  HomeNavigator: undefined;
};

export type HomeTabParamList = {
  HomeScreen: undefined;
  ProfileScreen: undefined;
  SettingsScreen: undefined;
  AuthNavigator: undefined;
};

/* Types for screens  */

export type WelcomeScreenNavigationProp = NativeStackScreenProps<
  AuthStackParamList,
  'WelcomeScreen'
>;

export type LoginScreenNavigationProp = NativeStackScreenProps<
  AuthStackParamList,
  'LoginScreen'
>;

export type CheckEmailScreenNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'CheckEmailScreen'
>;

export type NewPasswordScreenNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'NewPasswordScreen'
>;

export type HomeScreenNavigationProps = BottomTabScreenProps<
  HomeTabParamList,
  'HomeScreen'
>;

export type ProfileScreenNavigationProps = BottomTabScreenProps<
  HomeTabParamList,
  'ProfileScreen'
>;

export type SettingsScreenNavigationProps = BottomTabScreenProps<
  HomeTabParamList,
  'SettingsScreen'
>;
