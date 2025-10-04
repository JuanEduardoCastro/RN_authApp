import { BackHandler, Platform, ToastAndroid } from 'react-native';
import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const useBackHandler = () => {
  const countRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
