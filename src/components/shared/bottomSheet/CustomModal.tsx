/**
 * CustomModal
 * Bottom-sheet modal with a Cancel/Done header, used for pickers like the
 * language selector. Reference fix for the iPad "Designed for iPhone" bug:
 * reads `useWindowDimensions()` reactively and drives its own `translateY`
 * with `withTiming` instead of Reanimated's SlideInDown/SlideOutDown presets.
 */
import React, { ReactNode, useEffect } from 'react';

import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import useStyles from '@hooks/useStyles';

import {
  clampedHeightRatio,
  moderateScale,
  SCREEN,
} from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import AppText from '../appsComps/AppText';
import Separator from '../Separator';

type CustomModalProps = {
  children: ReactNode;
  modalIsVisible: boolean;
  toggleSheet: () => void;
};

const CustomModal = ({
  children,
  modalIsVisible,
  toggleSheet,
}: CustomModalProps) => {
  const { styles } = useStyles(createStyles);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const sheetHeight = clampedHeightRatio(windowHeight) * 300;

  const translateY = useSharedValue(sheetHeight);

  useEffect(() => {
    translateY.value = withTiming(modalIsVisible ? 0 : sheetHeight, {
      duration: 250,
    });
  }, [modalIsVisible, sheetHeight, translateY]);

  const progress = useDerivedValue(() =>
    withTiming(modalIsVisible ? 0 : 1, { duration: 100 }),
  );

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: 0.5 - progress.value,
    zIndex: modalIsVisible
      ? 1
      : withDelay(300, withTiming(-1, { duration: 0 })),
  }));

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleCancelButton = () => {
    toggleSheet();
  };

  const handleDoneButton = () => {
    toggleSheet();
  };

  return (
    <Modal
      animationType={'none'}
      transparent={true}
      visible={modalIsVisible}
      onRequestClose={toggleSheet}>
      <Animated.View
        style={[
          styles.backdrop,
          { width: windowWidth, height: windowHeight },
          animatedBackdropStyle,
        ]}>
        <Pressable style={styles.closeButton} onPress={toggleSheet} />
      </Animated.View>
      <Animated.View
        style={[
          styles.bottomSheet,
          { height: sheetHeight },
          animatedSheetStyle,
        ]}>
        <View style={styles.header}>
          <View style={styles.cropLine}>
            <Separator borderWidth={3} height={12} />
          </View>
          <View style={styles.commandsBox}>
            <Pressable onPress={handleCancelButton}>
              <AppText style={styles.commandsText}>Cancel</AppText>
            </Pressable>
            <Pressable onPress={handleDoneButton}>
              <AppText style={styles.commandsText}>Done</AppText>
            </Pressable>
          </View>
        </View>
        <View style={styles.contentBox}>{children}</View>
      </Animated.View>
    </Modal>
  );
};

export default CustomModal;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {},
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.gray,
      opacity: 0.5,
      zIndex: 1,
    },
    closeButton: {
      flex: 1,
    },
    bottomSheet: {
      backgroundColor: colors.background,
      padding: 8,
      width: SCREEN.width100,
      position: 'absolute',
      bottom: 0,
      borderTopRightRadius: 32,
      borderTopLeftRadius: 32,
      zIndex: 2,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    header: {
      alignItems: 'center',
    },
    cropLine: {
      width: 60,
      overflow: 'hidden',
      borderRadius: 50,
    },
    commandsBox: {
      width: SCREEN.contentWidth,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(24),
      paddingVertical: 6,
      marginBottom: 8,
    },
    commandsText: {
      ...textVar.baseBold,
      color: colors.text,
    },
    contentBox: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 8,
    },
  });
