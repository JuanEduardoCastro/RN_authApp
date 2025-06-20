import { lightMode, sharedColors } from './colors';

export type ColorMode = 'light' | 'dark';

export type TColors = typeof lightMode & typeof sharedColors;
