/**
 * useBackHandler
 * Implements Android's "press back again to exit" pattern: the first
 * hardware back-press while a screen is focused shows a toast, a second
 * press within 2 seconds exits the app. No-ops on iOS.
 */
import { useCallback, useRef } from 'react';

import { BackHandler, Platform, ToastAndroid } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

const useBackHandler = () => {
  const countRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') {
        return;
      }

      const onBackPress = () => {
        if (countRef.current === 0) {
          countRef.current = 1;
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

          timeoutRef.current = setTimeout(() => {
            countRef.current = 0;
          }, 2000);
        } else if (countRef.current === 1) {
          BackHandler.exitApp();
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        subscription.remove();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []),
  );
};

export default useBackHandler;
