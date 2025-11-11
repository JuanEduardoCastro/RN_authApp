import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { ReactNode } from 'react';

type DismissKeyboardOnClickProps = {
  children: ReactNode;
};

const DismissKeyboardOnClick = ({ children }: DismissKeyboardOnClickProps) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardOnClick;
