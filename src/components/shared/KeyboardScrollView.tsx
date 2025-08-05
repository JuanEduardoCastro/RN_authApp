import { Keyboard, ScrollView, StyleSheet } from 'react-native';
import React, { ReactNode, useEffect, useRef } from 'react';

import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type KeyboardScrollViewProps = {
  children: ReactNode;
  extraScroll?: number;
};

const KeyboardScrollView = ({
  children,
  extraScroll = 100,
}: KeyboardScrollViewProps) => {
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bottomOffset={20 + extraScroll}
      disableScrollOnKeyboardHide={true}
      extraKeyboardSpace={10}
      keyboardShouldPersistTaps={'always'}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardScrollView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
