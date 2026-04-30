import React, { ReactNode } from 'react';

import { Keyboard, TouchableWithoutFeedback } from 'react-native';

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
