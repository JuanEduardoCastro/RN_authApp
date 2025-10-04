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
  const { colors, styles } = useStyles(createStyles);

  return (
    <Pressable
      testID="button"
      style={({ pressed }) => [
        styles.button,
        buttonStyles,
        props.disabled && styles.disabled,
      ]}
      {...props}>
      <Text style={[styles.text, textStyles]}>{title}</Text>
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
      color: colors.textNgt,
    },
    disabled: {
      opacity: 0.5,
    },
  });
