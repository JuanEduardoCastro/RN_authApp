import React from 'react';

import { ColorValue, StyleSheet, View } from 'react-native';

import useStyles from '@hooks/useStyles';

import { SCREEN } from '@constants/dimensions';
import { TColors } from '@constants/types';

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
      {/* eslint-disable react-native/no-inline-styles */}
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
      {/* eslint-enable react-native/no-inline-styles */}
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
