import { StyleSheet } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';

const BorderMaskGradient = () => {
  const { colors, styles } = useStyles(createStlyes);

  return (
    <LinearGradient
      style={styles.gradient}
      colors={[colors.transparent, colors.background, colors.transparent]}
    />
  );
};

export default BorderMaskGradient;

const createStlyes = (colors: TColors) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
    },
  });
