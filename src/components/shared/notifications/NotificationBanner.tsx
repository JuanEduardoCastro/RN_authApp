/* Core libs & third parties libs */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
/* Custom components */
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import { useAppDispatch, useAppSelector } from 'src/store/authHook';
/* Types */
import { TColors } from '@constants/types';
/* Utilities & constants */
import { setNotificationMessage, userAuth } from 'src/store/authSlice';
import { textVar } from '@constants/textVar';
/* Assets */
import {
  ErrorIcon,
  InfoIcon,
  SuccessIcon,
  WarningIcon,
} from '@assets/svg/icons';

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
        dispatch(
          setNotificationMessage({
            messageType: null,
            notificationMessage: null,
          }),
        );
      }, 4000);
    }
  }, [messageType]);

  const handleCloseBanner = () => {
    starAnimation(-100);
    dispatch(
      setNotificationMessage({ messageType: null, notificationMessage: null }),
    );
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
                          width={32}
                          height={32}
                          color={colors.danger}
                        />
                      );
                    case 'success':
                      return (
                        <SuccessIcon
                          width={32}
                          height={32}
                          color={colors.accept}
                        />
                      );
                    case 'information':
                      return (
                        <InfoIcon
                          width={32}
                          height={32}
                          color={colors.primary}
                        />
                      );
                    case 'warning':
                      return (
                        <WarningIcon
                          width={32}
                          height={32}
                          color={colors.warning}
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
              blurAmount={4}
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
      marginTop: 12,
      paddingHorizontal: 16,
    },
    bannerBox: {
      backgroundColor: colors.notifications,
      opacity: 0.86,
      height: 70,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 8,
      zIndex: 9,
    },
    bannerTextBox: {
      flexShrink: 1,
    },
    bannerText: {
      ...textVar.baseBold,
      color: colors.text,
    },
    bannerIconBox: {
      width: 32,
    },
    blurView: {
      height: 60,
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: 24,
    },
  });
