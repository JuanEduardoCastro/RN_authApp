import { View, Text, useWindowDimensions, Platform } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UseWhenToScroll } from './types';
import { SCREEN } from '@constants/sizes';

const useWhenToScroll = (layoutHeight: number) => {
  const { width, height } = useWindowDimensions();
  const inset = useSafeAreaInsets();

  useEffect(() => {
    const headerHeight = SCREEN.heightFixed * 28;
    const tabbarHeight =
      Platform.OS === 'ios' ? SCREEN.heightFixed * 80 : SCREEN.heightFixed * 60;

    const calcHeight = height - headerHeight - tabbarHeight;
  }, []);
  return {};
};

export default useWhenToScroll;
