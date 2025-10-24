/* Core libs & third parties libs */
import {
  View,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React, { ElementType } from 'react';
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

type ButtonWithIconProps = {
  title?: string;
  buttonStyles?: ViewStyle;
  textStyles?: TextStyle;
  Icon?: ElementType | undefined;
  iconProps?: Record<string, any>;
  atPosition?: 'column' | 'row' | 'column-reverse' | 'row-reverse';
} & PressableProps;

const ButtonWithIcon = ({
  title = 'Go to',
  buttonStyles,
  textStyles,
  Icon,
  iconProps,
  atPosition = 'row',
  ...props
}: ButtonWithIconProps) => {
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
      <Animated.View
        style={[
          styles.button,
          buttonStyles,
          { flexDirection: atPosition },
          animationStyles,
        ]}>
        {Icon && (
          <View style={styles.iconBox}>
            <Icon {...iconProps} />
          </View>
        )}
        <Text style={[styles.text, textStyles]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

export default ButtonWithIcon;

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
      gap: 8,
    },
    iconBox: {},
    text: {
      ...textVar.base,
      textAlign: 'center',
      // color: colors.danger,
    },
    disabled: {
      opacity: 0.5,
    },
  });
