import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREEN } from '@constants/sizes';
import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from '@assets/svg/icons';
import { useAppDispatch, useAppSelector } from 'src/store/authHook';
import { setMessageType, userAuth } from 'src/store/authSlice';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';

const NotificationBanner = () => {
  const { notificationMessage, messageType } = useAppSelector(userAuth);
  const dispatch = useAppDispatch();
  const { colors, styles } = useStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [openBanner, setOpenBanner] = useState<boolean>(false);
  const translateY = useSharedValue(-100);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const starAnimation = (val: number) => {
    translateY.value = withTiming(val, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
  };

  useEffect(() => {
    if (!messageType) {
      setOpenBanner(false);
    }
    if (messageType) {
      setOpenBanner(true);
      starAnimation(0);

      setTimeout(() => {
        starAnimation(-100);
        dispatch(setMessageType(null));
      }, 4000);
    }
  }, [messageType]);

  const handleCloseBanner = () => {
    starAnimation(-100);
    dispatch(setMessageType(null));
  };

  return (
    <>
      {openBanner && (
        <Animated.View
          style={[styles.container, animatedStyle, { paddingTop: insets.top }]}>
          <Pressable onPress={handleCloseBanner}>
            <View style={styles.bannerBox}>
              <View style={styles.bannerTextBox}>
                <Text style={styles.bannerText}>
                  {notificationMessage as string}
                </Text>
              </View>
              <View style={styles.bannerIconBox}>
                {(() => {
                  switch (messageType) {
                    case 'error':
                      return (
                        <ErrorIcon
                          width={42}
                          height={42}
                          color={colors.cancel}
                        />
                      );
                    case 'success':
                      return (
                        <SuccessIcon
                          width={42}
                          height={42}
                          color={colors.accept}
                        />
                      );
                    case 'information':
                      return (
                        <InfoIcon
                          width={42}
                          height={42}
                          color={colors.primary}
                        />
                      );
                    case 'warning':
                      return (
                        <WarningIcon
                          width={42}
                          height={42}
                          color={colors.cancel}
                        />
                      );
                    default:
                      break;
                  }
                })()}
              </View>
            </View>
            <BlurView
              style={styles.blurView}
              blurType={'dark'}
              blurAmount={7}
              overlayColor={colors.transparent}
            />
          </Pressable>
        </Animated.View>
      )}
    </>
  );
};

export default NotificationBanner;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      height: 150,
      backgroundColor: colors.transparent,
      zIndex: 100,
      paddingHorizontal: 16,
    },
    bannerBox: {
      backgroundColor: colors.notifications,
      height: 60,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      zIndex: 9,
    },
    bannerTextBox: {
      flexShrink: 1,
    },
    bannerText: {
      color: colors.almostWhite,
      fontSize: 16,
    },
    bannerIconBox: {
      width: 44,
    },
    blurView: {
      height: 60,
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: 12,
    },
  });
