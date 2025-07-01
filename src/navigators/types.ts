/* types for navigators */

import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  AuthNavigator: undefined;
};

export type AuthStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  CheckEmailScreen: undefined;
  SigninScreen: { email: string };
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

export type SigninScreenNavigationProps = NativeStackScreenProps<
  AuthStackParamList,
  'SigninScreen'
>;
