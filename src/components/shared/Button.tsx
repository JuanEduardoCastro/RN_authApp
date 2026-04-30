import React from 'react';

import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import useStyles from '@hooks/useStyles';

import { scale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

type ButtonProps = {
  title?: string;
  buttonStyles?: ViewStyle;
  textStyles?: TextStyle;
} & PressableProps;

const Button = ({
  title = 'Go to',
  buttonStyles,
  textStyles,
  ...props
}: ButtonProps) => {
  const { styles } = useStyles(createStyles);
  const sharedScale = useSharedValue(1);

  const animationStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: sharedScale.value }],
    };
  });

  const handlePressIn = () => {
    sharedScale.value = withTiming(0.97, { duration: 80 });
  };

  const handlePressOut = () => {
    sharedScale.value = withTiming(1, { duration: 150 });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!props.disabled }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID="button"
      style={[props.disabled && styles.disabled]}
      {...props}>
      <Animated.View style={[styles.button, animationStyles, buttonStyles]}>
        <Text style={[styles.text, textStyles]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default Button;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    button: {
      maxWidth: SCREEN.width100,
      height: SCREEN.heightFixed * 46,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.second,
      paddingHorizontal: scale(10),
      paddingVertical: scale(8),
      borderRadius: 50,
    },
    text: {
      ...textVar.medium,
      // color: colors.text,
    },
    disabled: {
      opacity: 0.5,
    },
  });
