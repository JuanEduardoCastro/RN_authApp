import { TColors } from '@constants/types';
import { useMode } from '@context/ThemeContext';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Styles } from './types';

export default function <T extends StyleSheet.NamedStyles<T>>(
  createStyles: (colors: TColors) => T,
): Styles<T> {
  const { colors } = useMode();

  return {
    colors: colors,
    styles: useMemo(() => createStyles(colors), [colors, createStyles]),
  };
}
