/* types for navigators */

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  AuthNavigator: NavigatorScreenParams<AuthStackParamList>;
  HomeScreen: undefined;
};

export type AuthStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  CheckEmailScreen: undefined;
  NewPasswordScreen: { deepLink: string | null };
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

export type HomeScreenNavigationProps = NativeStackScreenProps<
  RootStackParamList,
  'HomeScreen'
>;
