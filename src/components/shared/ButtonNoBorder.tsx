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
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        props.disabled && styles.disabled,
      ]}
      {...props}>
      <Text style={[styles.gobackText, textStyles]}>{title}</Text>
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
