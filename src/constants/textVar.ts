import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const fontScale = PixelRatio.getFontScale();

export const FONT = {
  base: 16,
};
