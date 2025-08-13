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
    <Pressable style={{ padding: 8 }} {...props}>
      <Text style={[styles.gobackText, textStyles]}>{title}</Text>
    </Pressable>
  );
};

export default ButtonNoBorder;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    gobackText: {
      ...textVar.mediumBold,
      color: colors.second,
    },
  });
