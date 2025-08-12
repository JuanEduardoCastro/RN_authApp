import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Easing } from 'react-native-reanimated';
import { COLOR, sharedColors } from '@constants/colors';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';

const Loader = () => {
  const { colors, styles } = useStyles(createStyles);
  const spinValue = new Animated.Value(0);
  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spin());
  };

  useEffect(() => {
    spin();
  }, [rotate]);

  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <View style={[styles.circleContainer, { transform: [{ scale: 0.3 }] }]}>
          <View style={styles.dot1}></View>
          <View style={styles.dot2}></View>
          <View style={styles.dot3}></View>
          <View style={styles.dot4}></View>
          <View style={styles.dot5}></View>
          <View style={styles.dot6}></View>
          <View style={styles.dot7}></View>
          <View style={styles.dot8}></View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Loader;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      // width: SCREEN.fullWidth,
      // height: SCREEN.fullHeight,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
      zIndex: 100,
    },
    circleContainer: {
      width: 300 * 0.9,
      height: 300 * 0.9,
      borderRadius: 300,
      // backgroundColor: 'rgba(0,0,0,0.0)',
    },
    dot1: {
      position: 'absolute',
      width: 15 * 0.9,
      height: 15 * 0.9,
      top: 78 * 0.9,
      right: 98 * 0.9,
      backgroundColor: colors.base,
      // backgroundColor: '#ffff',
      borderRadius: 50,
    },
    dot2: {
      position: 'absolute',
      width: 20 * 0.9,
      height: 20 * 0.9,
      top: 115 * 0.9,
      right: 55 * 0.9,
      backgroundColor: colors.base,
      // backgroundColor: '#ffff',
      borderRadius: 50,
    },
    dot3: {
      position: 'absolute',
      width: 25 * 0.9,
      height: 25 * 0.9,
      bottom: 100 * 0.9,
      right: 55 * 0.9,
      backgroundColor: colors.base,
      // backgroundColor: '#ffff',
      borderRadius: 50,
    },
    dot4: {
      position: 'absolute',
      width: 30 * 0.9,
      height: 30 * 0.9,
      bottom: 50 * 0.9,
      right: 100 * 0.9,
      backgroundColor: colors.base,
      // backgroundColor: '#ffff',
      borderRadius: 50,
    },
    dot5: {
      position: 'absolute',
      width: 35 * 0.9,
      height: 35 * 0.9,
      bottom: 50 * 0.9,
      left: 105 * 0.9,
      backgroundColor: colors.base,
      // backgroundColor: '#ffff',
      borderRadius: 50,
    },
    dot6: {
      position: 'absolute',
      width: 40 * 0.9,
      height: 40 * 0.9,
      bottom: 90 * 0.9,
      left: 50 * 0.9,
      backgroundColor: colors.base,
      // backgroundColor: '#ffff',
      borderRadius: 50,
    },
    dot7: {
      position: 'absolute',
      width: 45 * 0.9,
      height: 45 * 0.9,
      top: 95 * 0.9,
      left: 50 * 0.9,
      backgroundColor: colors.base,
      // backgroundColor: '#ffff',
      borderRadius: 50,
    },
    dot8: {
      position: 'absolute',
      width: 50 * 0.9,
      height: 50 * 0.9,
      top: 45 * 0.9,
      left: 110 * 0.9,
      backgroundColor: colors.base,
      // backgroundColor: '#ffff',
      borderRadius: 50,
    },
  });
