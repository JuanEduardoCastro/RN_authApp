import { SCREEN } from '@constants/sizes';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import React, { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Separator from '../Separator';
import { textVar } from '@constants/textVar';

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

  const translateY = useSharedValue(0);

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
    transform: [{ translateY: translateY.value * 2 }],
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
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <Pressable style={styles.closeButton} onPress={toggleSheet} />
      </Animated.View>
      <Animated.View
        style={[styles.bottomSheet, animatedSheetStyle]}
        entering={SlideInDown.springify().damping(60).stiffness(300)}
        exiting={SlideOutDown}>
        <View style={styles.header}>
          <View style={styles.cropLine}>
            <Separator borderWidth={3} height={12} />
          </View>
          <View style={styles.commandsBox}>
            <Pressable onPress={handleCancelButton}>
              <Text style={styles.commandsText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleDoneButton}>
              <Text style={styles.commandsText}>Done</Text>
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
      flex: 1,
      width: SCREEN.width100,
      height: SCREEN.height100,
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
      height: SCREEN.heightFixed * 300,
      width: '100%',
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
      width: SCREEN.width100,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
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
      // backgroundColor: 'blue',
    },
  });
