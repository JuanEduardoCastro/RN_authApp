import { ColorValue, StyleSheet, Text, View } from 'react-native';
import React from 'react';
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
  borderColor = 'lightgray',
  borderWidth = 0.8,
  borderStyle = 'solid',
}: SeparatorProps) => {
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
            borderColor: borderColor,
            borderStyle: borderStyle,
          },
        ]}
      />
    </View>
  );
};

export default Separator;

const styles = StyleSheet.create({
  separator: {
    width: SCREEN.width100,
    justifyContent: 'center',
  },
  line: {},
});
