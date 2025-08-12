import { View, Text, useWindowDimensions, Platform } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UseWhenToScroll } from './types';
import { SCREEN } from '@constants/sizes';

const useWhenToScroll = (layoutHeight: number) => {
  const { width, height } = useWindowDimensions();
  const inset = useSafeAreaInsets();
  console.log('este es el hight total', height);
  console.log('este es el hight total', layoutHeight);

  useEffect(() => {
    const headerHeight = SCREEN.heightFixed * 28;
    const tabbarHeight =
      Platform.OS === 'ios' ? SCREEN.heightFixed * 80 : SCREEN.heightFixed * 60;

    const calcHeight = height - headerHeight - tabbarHeight;
    console.log('calc', calcHeight);
  }, []);
  return {};
};

export default useWhenToScroll;
