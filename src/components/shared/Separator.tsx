import { ColorValue, StyleSheet, View } from 'react-native';
import React from 'react';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';

type SeparatorProps = {
  height?: number;
  background?: ColorValue;
  border?: boolean;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dotted' | 'dashed' | undefined;
};

const Separator = ({
  height = SCREEN.heightFixed * 32,
  background = 'transparent',
  border = true,
  borderColor,
  borderWidth = 0.8,
  borderStyle = 'solid',
}: SeparatorProps) => {
  const { colors, styles } = useStyles(createStyles);

  return (
    <View
      style={[
        styles.separator,
        { height: height, backgroundColor: background },
      ]}>
      <View
        style={[
          styles.line,
          {
            borderWidth: border ? borderWidth : 0,
            borderColor: colors.darkBase ?? borderColor,
            borderStyle: borderStyle,
          },
        ]}
      />
    </View>
  );
};

export default Separator;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    separator: {
      width: SCREEN.width100,
      justifyContent: 'center',
    },
    line: {
      backgroundColor: colors.transparent,
    },
  });
