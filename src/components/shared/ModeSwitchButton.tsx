import { Pressable, StyleSheet } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import { useMode } from '@context/ModeContext';

type ModeSwitchButtonProps = {
  width?: number;
  height?: number;
};

const ModeSwitchButton = ({
  width = SCREEN.widthFixed * 30,
  height = SCREEN.heightFixed * 18,
}: ModeSwitchButtonProps) => {
  const { mode, toggleMode } = useMode();
  const { colors, styles } = useStyles(createStlyes);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX =
      mode === 'light'
        ? withTiming(0, { duration: 200 })
        : withTiming(width / 2.3, { duration: 200 });
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Pressable
      style={[styles.container, { width, height }]}
      onPress={toggleMode}
      accessibilityRole="switch"
      accessibilityState={{ checked: mode === 'dark' }}
      accessibilityLabel="Toggle color mode">
      <Animated.View style={[styles.button, animatedStyle]} />
    </Pressable>
  );
};

export default ModeSwitchButton;

const createStlyes = (colors: TColors) =>
  StyleSheet.create({
    container: {
      borderRadius: 50,
      padding: 2,
      backgroundColor: colors.text,
    },
    button: {
      width: '50%',
      height: '100%',
      borderRadius: 50,
      backgroundColor: colors.background,
    },
  });
