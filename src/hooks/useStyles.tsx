import { TColors } from '@constants/types';
import { useMode } from '@context/ModeContext';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Styles } from './types';

export default function <T extends StyleSheet.NamedStyles<T>>(
  createStyles: (colors: TColors) => T,
): Styles<T> {
  const { colors } = useMode();

  return {
    colors: colors,
    // styles: useMemo(() => createStyles(colors), [colors, createStyles]),
    // The `createStyles` function is a stable recipe for creating styles.
    // We only need to re-compute the styles when the `colors` theme changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    styles: useMemo(() => createStyles(colors), [colors]),
  };
}
