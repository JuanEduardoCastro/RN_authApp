import { calm, gold, luxury, passion, sharedColors } from './colors';

export type ColorModeProps = 'light' | 'dark';

export type ColorThemeProps = 'calm' | 'passion' | 'gold' | 'luxury';

export type TColors = typeof luxury.lightMode &
  typeof luxury.darkMode &
  typeof calm.lightMode &
  typeof calm.darkMode &
  typeof gold.lightMode &
  typeof gold.darkMode &
  typeof passion.lightMode &
  typeof passion.darkMode &
  typeof sharedColors;

export type ColorNameProps = {
  darkMode: ThemeProps;
  lightMode: ThemeProps;
};

export type ThemeProps = {
  background: string;
  tabBackground: string;
  text: string;
  textNgt: string;
  second: string;
  notifications: string;
  base: string;
  darkBase: string;
};

// export type SharedColorsProps = {
//   primary: string;
//   accept: string;
//   cancel: string;
//   transparent: string;
//   almostBlack: string;
//   dark: string;
//   darkCard: string;
//   veryDarkGray: string;
//   darkGray: string;
//   gray: string;
//   lightgray: string;
//   veryLightGray: string;
//   lightCard: string;
//   light: string;
//   almostWhite: string;
// };
