import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { useMode } from '@context/ThemeContext';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import useStyles from '@hooks/useStyles';

type ModeSwitchButtonProps = {
  width?: number;
  height?: number;
};

const ModeSwitchButton = ({
  width = SCREEN.widthFixed * 38,
  height = SCREEN.heightFixed * 22,
}: ModeSwitchButtonProps) => {
  const { mode, toggleMode } = useMode();
  const { colors, styles } = useStyles(createStlyes);

  return (
    <Pressable
      style={[styles.container, { width, height }]}
      onPress={() => toggleMode()}>
      <View
        style={[
          styles.button,
          { alignSelf: mode === 'light' ? 'flex-start' : 'flex-end' },
        ]}
      />
    </Pressable>
  );
};

export default ModeSwitchButton;

const createStlyes = (colors: TColors) =>
  StyleSheet.create({
    container: {
      borderRadius: 50,
      padding: '0.8%',
      backgroundColor: colors.text,
    },
    button: {
      width: '50%',
      height: '100%',
      borderRadius: 50,
      backgroundColor: colors.background,
    },
  });
