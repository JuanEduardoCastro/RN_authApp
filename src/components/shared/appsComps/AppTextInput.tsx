import { TextInput, TextInputProps } from 'react-native';

const AppTextInput = (props: TextInputProps) => {
  return <TextInput {...props} allowFontScaling={false} />;
};

export default AppTextInput;
