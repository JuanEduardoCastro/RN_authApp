import { Animated, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Easing } from 'react-native-reanimated';
import { COLOR, sharedColors } from '@constants/colors';

const Loader = () => {
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

const styles = StyleSheet.create({
  container: {
    // width: SCREEN.fullWidth,
    // height: SCREEN.fullHeight,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 100,
  },
  circleContainer: {
    width: 300,
    height: 300,
    borderRadius: 300,
    // backgroundColor: 'rgba(0,0,0,0.0)',
  },
  dot1: {
    position: 'absolute',
    width: 15,
    height: 15,
    top: 78,
    right: 98,
    backgroundColor: COLOR.purple300,
    // backgroundColor: '#ffff',
    borderRadius: 50,
  },
  dot2: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 115,
    right: 55,
    backgroundColor: COLOR.purple300,
    // backgroundColor: '#ffff',
    borderRadius: 50,
  },
  dot3: {
    position: 'absolute',
    width: 25,
    height: 25,
    bottom: 100,
    right: 55,
    backgroundColor: COLOR.purple300,
    // backgroundColor: '#ffff',
    borderRadius: 50,
  },
  dot4: {
    position: 'absolute',
    width: 30,
    height: 30,
    bottom: 50,
    right: 100,
    backgroundColor: COLOR.purple300,
    // backgroundColor: '#ffff',
    borderRadius: 50,
  },
  dot5: {
    position: 'absolute',
    width: 35,
    height: 35,
    bottom: 50,
    left: 105,
    backgroundColor: COLOR.purple300,
    // backgroundColor: '#ffff',
    borderRadius: 50,
  },
  dot6: {
    position: 'absolute',
    width: 40,
    height: 40,
    bottom: 90,
    left: 50,
    backgroundColor: COLOR.purple300,
    // backgroundColor: '#ffff',
    borderRadius: 50,
  },
  dot7: {
    position: 'absolute',
    width: 45,
    height: 45,
    top: 95,
    left: 50,
    backgroundColor: COLOR.purple300,
    // backgroundColor: '#ffff',
    borderRadius: 50,
  },
  dot8: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: 45,
    left: 110,
    backgroundColor: COLOR.purple300,
    // backgroundColor: '#ffff',
    borderRadius: 50,
  },
});
