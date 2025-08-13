import { View, Text, BackHandler, NativeEventSubscription } from 'react-native';
import React, { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const useBackHandler = () => {
  const countRef = useRef(0);

  const handleSuscriptionRemove = (suscription: NativeEventSubscription) => {
    suscription.remove();
    countRef.current = 0;
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        countRef.current++;
        countRef.current === 3 && BackHandler.exitApp();
        return true;
      };

      const suscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => handleSuscriptionRemove(suscription);
    }, []),
  );
};

export default useBackHandler;
