import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { useMode } from '@context/ModeContext';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import useStyles from '@hooks/useStyles';

type ModeSwitchButtonProps = {
  width?: number;
  height?: number;
  onPress?: () => void;
};

const ModeSwitchButton = ({
  width = SCREEN.widthFixed * 30,
  height = SCREEN.heightFixed * 18,
  onPress = () => {},
}: ModeSwitchButtonProps) => {
  const { mode, toggleMode } = useMode();
  const { colors, styles } = useStyles(createStlyes);

  const handleToggleMode = () => {
    onPress();
    toggleMode();
  };

  return (
    <Pressable
      style={[styles.container, { width, height }]}
      onPress={handleToggleMode}>
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
