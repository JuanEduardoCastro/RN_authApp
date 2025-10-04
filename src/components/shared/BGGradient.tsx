import { StyleSheet, View } from 'react-native';
import React, { ReactNode } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREEN } from '@constants/sizes';

type BGGradientProps = {
  children: ReactNode;
  colorInit?: string;
  colorEnd?: string;
  useAngle?: boolean;
  angle?: number;
  angleCenter?: { x: number; y: number } | undefined;
};

const BGGradient = ({
  children,
  colorInit = '#131313',
  colorEnd = '#575757',
  useAngle = true,
  angle = 306.33,
  angleCenter = { x: 0.5, y: 0.5 },
}: BGGradientProps) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      style={styles.gradientContainer}
      colors={[colorInit, colorEnd]}
      useAngle={useAngle}
      angle={angle}
      angleCenter={angleCenter}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}>
        {children}
      </View>
    </LinearGradient>
  );
};

export default BGGradient;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: SCREEN.width100,
    height: SCREEN.height100,
  },
});
