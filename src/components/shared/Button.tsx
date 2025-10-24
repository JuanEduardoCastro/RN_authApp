/* Core libs & third parties libs */
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React from 'react';
/* Custom components */
/* Custom hooks */
import useStyles from '@hooks/useStyles';
/* Types */
import { TColors } from '@constants/types';
/* Utilities & constants */
import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
/* Assets */

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
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 50,
    },
    text: {
      ...textVar.base,
      // color: colors.text,
    },
    disabled: {
      opacity: 0.5,
    },
  });
