import manrope from './manrope';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const fontSizeScreen = (fontSize: number) => {
  return Math.round((width / 393) * fontSize);
};

export const textVar = {
  smallLight: {
    fontSize: fontSizeScreen(12),
    fontFamily: manrope.EXTRALIGHT,
  },
  small: {
    fontSize: fontSizeScreen(12),
    fontFamily: manrope.MEDIUM,
  },
  smallBold: {
    fontSize: fontSizeScreen(12),
    fontFamily: manrope.SEMIBOLD,
  },
  mediumLight: {
    fontSize: fontSizeScreen(14),
    fontFamily: manrope.LIGHT,
  },
  medium: {
    fontSize: fontSizeScreen(14),
    fontFamily: manrope.REGULAR,
  },
  mediumBold: {
    fontSize: fontSizeScreen(14),
    fontFamily: manrope.SEMIBOLD,
  },

  baseLight: {
    fontSize: fontSizeScreen(16),
    fontFamily: manrope.LIGHT,
  },
  base: {
    fontSize: fontSizeScreen(16),
    fontFamily: manrope.REGULAR,
  },
  baseBold: {
    fontSize: fontSizeScreen(16),
    fontFamily: manrope.BOLD,
  },
  largeLight: {
    fontSize: fontSizeScreen(18),
    fontFamily: manrope.LIGHT,
  },
  large: {
    fontSize: fontSizeScreen(18),
    fontFamily: manrope.REGULAR,
  },
  largeBold: {
    fontSize: fontSizeScreen(18),
    fontFamily: manrope.SEMIBOLD,
  },
  xlargeLight: {
    fontSize: fontSizeScreen(22),
    fontFamily: manrope.LIGHT,
  },
  xlarge: {
    fontSize: fontSizeScreen(22),
    fontFamily: manrope.REGULAR,
  },
  xlargeBold: {
    fontSize: fontSizeScreen(22),
    fontFamily: manrope.SEMIBOLD,
  },
  xxlargeLight: {
    fontSize: fontSizeScreen(24),
    fontFamily: manrope.LIGHT,
  },
  xxlarge: {
    fontSize: fontSizeScreen(24),
    fontFamily: manrope.REGULAR,
  },
  xxlargeBold: {
    fontSize: fontSizeScreen(24),
    fontFamily: manrope.SEMIBOLD,
  },
  titleLight: {
    fontSize: fontSizeScreen(30),
    fontFamily: manrope.LIGHT,
  },
  title: {
    fontSize: fontSizeScreen(30),
    fontFamily: manrope.REGULAR,
  },
  titleBold: {
    fontSize: fontSizeScreen(30),
    fontFamily: manrope.SEMIBOLD,
  },
};
