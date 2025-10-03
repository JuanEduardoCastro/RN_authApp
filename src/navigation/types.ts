/* types for navigators */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

/* declare root navigator */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/* param list for navigators */

export type RootStackParamList = {
  AuthNavigator: NavigatorScreenParams<AuthStackParamList>;
  HomeNavigator: NavigatorScreenParams<HomeTabParamList>;
};

export type AuthStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  CheckEmailScreen: { checkMode: 'new_password' | 'reset_password' };
  NewPasswordScreen: { emailToken: string | null };
};

export type HomeTabParamList = {
  HomeScreen: undefined;
  SettingsNavigator: NavigatorScreenParams<SettingsParamList>;
};

export type SettingsParamList = {
  SettingsScreen: undefined;
  ProfileScreen: undefined;
};

/* Props for navigators & screens (extends of param list) */

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type SettingsStackScreenProps<T extends keyof SettingsParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<SettingsParamList, T>,
    HomeTabScreenProps<keyof HomeTabParamList>
  >;

/* Props for screens  */

// export type WelcomeScreenNavigationProp = NativeStackScreenProps<
//   AuthStackParamList,
//   'WelcomeScreen'
// >;

// export type LoginScreenNavigationProp = NativeStackScreenProps<
//   AuthStackParamList,
//   'LoginScreen'
// >;

// export type CheckEmailScreenNavigationProps = NativeStackScreenProps<
//   AuthStackParamList,
//   'CheckEmailScreen'
// >;

// export type NewPasswordScreenNavigationProps = NativeStackScreenProps<
//   AuthStackParamList,
//   'NewPasswordScreen'
// >;

// export type HomeScreenNavigationProps = BottomTabScreenProps<
//   HomeTabParamList,
//   'HomeScreen'
// >;

// export type ProfileScreenNavigationProps = BottomTabScreenProps<
//   HomeTabParamList,
//   'ProfileScreen'
// >;

// export type ProfileScreenNavigationProps = NativeStackScreenProps<
//   SettingsParamList,
//   'ProfileScreen'
// >;

// export type ProfileScreenNavigationProps = CompositeScreenProps<
//   BottomTabScreenProps<HomeTabParamList, 'SettingsNavigator'>,
//   NativeStackScreenProps<RootStackParamList>
// >;

// export type SettingsScreenNavigationProps = NativeStackScreenProps<
//   SettingsParamList,
//   'SettingsScreen'
// >;
