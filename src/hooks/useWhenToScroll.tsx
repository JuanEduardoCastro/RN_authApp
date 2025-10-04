import { useWindowDimensions, Platform } from 'react-native';
import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREEN } from '@constants/sizes';

/**
 * A custom hook to determine if content needs to be scrollable.
 * @param layoutHeight The measured height of the content layout.
 * @returns A boolean indicating if the content height exceeds the available screen space.
 */
const useWhenToScroll = (layoutHeight: number): boolean => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const shouldScroll = useMemo(() => {
    if (!layoutHeight) {
      return false;
    }

    const headerHeight = SCREEN.heightFixed * 28;
    const tabbarHeight =
      Platform.OS === 'ios' ? SCREEN.heightFixed * 80 : SCREEN.heightFixed * 60;

    const availableHeight =
      height - headerHeight - tabbarHeight - insets.top - insets.bottom;

    return layoutHeight > availableHeight;
  }, [layoutHeight, height, insets]);

  return shouldScroll;
};

export default useWhenToScroll;
