import React from 'react';

import {
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import useStyles from '@hooks/useStyles';

import { SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import AppText from './AppText';

type AppButtonProps = {
  title?: string;
  buttonStyles?: ViewStyle;
  textStyles?: TextStyle;
} & PressableProps;

const AppButton = ({
  title = 'Go to',
  buttonStyles,
  textStyles,
  style,
  ...props
}: AppButtonProps) => {
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
      {...props}
      style={[style as ViewStyle, props.disabled && styles.disabled]}>
      <Animated.View style={[styles.button, animationStyles, buttonStyles]}>
        <AppText style={[styles.text, textStyles]}>{title}</AppText>
      </Animated.View>
    </Pressable>
  );
};

export default AppButton;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    button: {
      alignSelf: 'stretch',
      height: SCREEN.heightFixed * 46,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.second,
      // paddingHorizontal: moderateScale(10),
      // paddingVertical: moderateScale(8),
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
