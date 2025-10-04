import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import useKeyboardEvents from '@hooks/useKeyboardEvents';

type KeyboardScrollViewProps = {
  children: ReactNode;
  extraBottomOffset?: number;
  scrollEnabled?: boolean;
};

const KeyboardScrollView = ({
  children,
  extraBottomOffset = 100,
  scrollEnabled = true,
}: KeyboardScrollViewProps) => {
  const { isKeyboardOpen } = useKeyboardEvents();

  return (
    <KeyboardAwareScrollView
      ScrollViewComponent={ScrollView}
      scrollEnabled={isKeyboardOpen || scrollEnabled}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bottomOffset={20 + extraBottomOffset}
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
