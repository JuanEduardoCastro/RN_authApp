/**
 * AppTextInput
 * Drop-in replacement for RN's `TextInput` that hardcodes
 * `allowFontScaling={false}` (covers both typed and placeholder text). Must
 * be used instead of bare `<TextInput>` everywhere in the app.
 */
import { TextInput, TextInputProps } from 'react-native';

const AppTextInput = (props: TextInputProps) => {
  return <TextInput {...props} allowFontScaling={false} />;
};

export default AppTextInput;
