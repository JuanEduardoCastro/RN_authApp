import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import useStyles from '@hooks/useStyles';

type BottonProps = {
  title?: string;
  buttonStyles?: ViewStyle;
  textStyles?: TextStyle;
} & PressableProps;

const Button = ({
  title = 'Go to',
  buttonStyles,
  textStyles,
  ...props
}: BottonProps) => {
  const { colors, styles } = useStyles(createStyles);

  return (
    <Pressable style={[styles.button, buttonStyles]} {...props}>
      <Text style={[textStyles, { fontSize: 16 }]}>{title}</Text>
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
      backgroundColor: 'white',
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 12,
    },
  });
