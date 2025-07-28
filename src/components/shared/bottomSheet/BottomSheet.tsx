import { Modal, Pressable, StyleSheet, View } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import Separator from '../Separator';

type BottomSheetProps = {
  isOpen: SharedValue<boolean>;
  toggleSheet: () => void;
  duration?: number;
  children: ReactNode;
};

const BottomSheet = ({
  isOpen,
  toggleSheet,
  duration = 300,
  children,
}: BottomSheetProps) => {
  const { colors, styles } = useStyles(createStlyes);
  const height = useSharedValue(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    isOpen.value ? setIsVisible(true) : setIsVisible(false);
  }, [isOpen.value]);

  const handleCloseModal = () => {
    setIsVisible(false);
  };

  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration }),
  );

  const styleSheet = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 0.5 - progress.value,
    zIndex: isOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={handleCloseModal}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.closeButton} onPress={toggleSheet} />
      </Animated.View>
      <Animated.View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[styles.sheet, styleSheet]}>
        <View style={styles.cropLine}>
          <Separator borderWidth={3} height={12} />
        </View>
        {children}
      </Animated.View>
    </Modal>
  );
};

export default BottomSheet;

const createStlyes = (colors: TColors) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      width: SCREEN.width100,
      height: SCREEN.height100,
      backgroundColor: colors.gray,
    },
    closeButton: {
      flex: 1,
    },
    sheet: {
      backgroundColor: colors.background,
      padding: 8,
      height: SCREEN.heightFixed * 300,
      width: '100%',
      position: 'absolute',
      bottom: 0,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      zIndex: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cropLine: {
      width: 60,
      overflow: 'hidden',
      borderRadius: 50,
    },
  });
