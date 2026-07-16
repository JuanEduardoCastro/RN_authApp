/**
 * Separator
 * Generic vertical spacer/divider, optionally rendering a horizontal line.
 * Used throughout modals and screens for consistent vertical rhythm instead
 * of ad-hoc margins.
 */
import React from 'react';

import { ColorValue, StyleSheet, View } from 'react-native';

import useStyles from '@hooks/useStyles';

import { moderateScale, SCREEN } from '@constants/dimensions';
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
        { height: moderateScale(height), backgroundColor: background },
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
      width: '100%',
      justifyContent: 'center',
    },
    line: {
      backgroundColor: colors.transparent,
    },
  });
