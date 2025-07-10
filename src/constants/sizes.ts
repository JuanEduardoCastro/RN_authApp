import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN = {
  width100: width,
  height100: height,
  width75: width * 0.75,
  height75: height * 0.75,
  width50: width * 0.5,
  height50: height * 0.5,
  width25: width * 0.25,
  height25: height * 0.25,
  widthFixed: width / 393, // THE SIZE OF THE DESIGNE
  heightFixed: height / 852, // THE SIZE OF THE DESIGNE
};
