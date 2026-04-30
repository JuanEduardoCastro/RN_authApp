import { Dimensions } from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

export const scale = (size: number) => Math.round((SW / BASE_WIDTH) * size);

export const verticalScale = (size: number) =>
  Math.round((SH / BASE_HEIGHT) * size);

export const moderateScale = (size: number, factor = 0.45) =>
  Math.round(size + (scale(size) - size) * factor);

const SCREEN = {
  width100: SW,
  height100: SH,
  width90: SW * 0.9,
  height90: SH * 0.9,
  width80: SW * 0.8,
  height80: SH * 0.8,
  width75: SW * 0.75,
  height75: SH * 0.75,
  width50: SW * 0.5,
  height50: SH * 0.5,
  width25: SW * 0.25,
  height25: SH * 0.25,
  widthFixed: SW / 393, // THE SIZE OF THE DESIGNE
  heightFixed: SH / 852, // THE SIZE OF THE DESIGNE
};

export { SCREEN, SH, SW };
