import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
} from 'react-native';
import React from 'react';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { textVar } from '@constants/textVar';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type ButtonNoBorderProps = {
  title: string;
  textStyles?: TextStyle;
} & PressableProps;

const ButtonNoBorder = ({
  title,
  textStyles,
  ...props
}: ButtonNoBorderProps) => {
  const { colors, styles } = useStyles(createStyles);
  const scale = useSharedValue(1);

  const animationStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={({ pressed }) => [props.disabled && styles.disabled]}
      {...props}>
      <Animated.View style={[styles.button, animationStyles]}>
        <Text style={[styles.gobackText, textStyles]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default ButtonNoBorder;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    button: {
      padding: 8,
    },
    gobackText: {
      ...textVar.mediumBold,
      color: colors.second,
    },
    disabled: {
      opacity: 0.5,
    },
  });
