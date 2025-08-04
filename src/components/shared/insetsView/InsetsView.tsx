import { View, Text } from 'react-native';
import React, { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type InsetsViewProps = {
  children: ReactNode;
  safeTop?: boolean;
  safeLeft?: boolean;
  safeBottom?: boolean;
  safeRight?: boolean;
};
const InsetsView = ({
  children,
  safeTop,
  safeLeft,
  safeBottom,
  safeRight,
}: InsetsViewProps) => {
  const inset = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: safeTop ? inset.top : 0,
        paddingLeft: safeLeft ? inset.left : 0,
        paddingBottom: safeBottom ? inset.bottom : 0,
        paddingRight: safeRight ? inset.right : 0,
      }}>
      {children}
    </View>
  );
};

export default InsetsView;
