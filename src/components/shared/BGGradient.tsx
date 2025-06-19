import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  children: ReactNode;
};

const { width, height } = Dimensions.get('screen');

const BGGradient = ({ children }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      style={styles.gradientContainer}
      colors={['#131313', '#575757']}
      {...{
        useAngle: true,
        angle: 306.33,
        angleCenter: { x: 0.5, y: 0.5 },
      }}>
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
    width: width,
    height: height,
  },
});
