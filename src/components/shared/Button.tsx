import {
  Dimensions,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
} from 'react-native';
import React from 'react';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';

type BottonProps = {
  title?: string;
  textStyles?: TextStyle;
} & PressableProps;

const { width, height } = Dimensions.get('screen');

const Button = ({ title = 'Go to', textStyles, ...props }: BottonProps) => {
  const { colors, styles } = useStyles(createStyles);

  return (
    <Pressable style={[styles.button]} {...props}>
      <Text style={[textStyles, { fontSize: 16 }]}>{title} </Text>
    </Pressable>
  );
};

export default Button;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    button: {
      maxWidth: width,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 12,
    },
  });
