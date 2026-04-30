import { useMemo } from 'react';

import { StyleSheet } from 'react-native';

import { useMode } from '@context/ModeContext';

import { TColors } from '@constants/types';

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
