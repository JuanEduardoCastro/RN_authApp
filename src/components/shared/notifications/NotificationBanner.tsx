/* Core libs & third parties libs */
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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

const iconMap = {
  error: { Icon: ErrorIcon, color: 'danger' as keyof TColors },
  success: { Icon: SuccessIcon, color: 'accept' as keyof TColors },
  information: { Icon: InfoIcon, color: 'primary' as keyof TColors },
  warning: { Icon: WarningIcon, color: 'warning' as keyof TColors },
};

const NotificationBanner = () => {
  const { notificationMessage, messageType } = useAppSelector(userAuth);
  const dispatch = useAppDispatch();
  const { colors, styles } = useStyles(createStyles);
  const insets = useSafeAreaInsets();
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
    let timeoutId: NodeJS.Timeout;

    if (messageType) {
      starAnimation(0);

      timeoutId = setTimeout(() => {
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

  const IconComponent = messageType ? iconMap[messageType] : null;

  return (
    <>
      {messageType && (
        <Animated.View
          accessibilityRole="alert"
          accessibilityLabel={`Notification: ${notificationMessage}`}
          style={[styles.container, animatedStyle, { paddingTop: insets.top }]}>
          <Pressable
            onPress={handleCloseBanner}
            style={
              Platform.OS === 'android' && {
                backgroundColor: colors.dark,
                borderRadius: 24,
                opacity: 0.96,
              }
            }>
            <View style={styles.bannerBox}>
              <View style={styles.bannerTextBox}>
                <Text style={styles.bannerText}>
                  {notificationMessage as string}
                </Text>
              </View>
              <View style={styles.bannerIconBox}>
                {IconComponent && (
                  <IconComponent.Icon
                    width={32}
                    height={32}
                    color={colors[IconComponent.color]}
                  />
                )}
              </View>
            </View>
            {Platform.OS === 'ios' && (
              <BlurView
                style={styles.blurView}
                blurType={'dark'}
                blurAmount={4}
                overlayColor={colors.transparent}
              />
            )}
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
      height: 100,
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
      color: colors.veryLightGray,
    },
    bannerIconBox: {
      width: 32,
    },
    blurView: {
      height: 70,
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      borderRadius: 24,
    },
  });
