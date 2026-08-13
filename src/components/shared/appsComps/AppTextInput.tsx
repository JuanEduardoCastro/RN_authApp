/**
 * AppTextInput
 * Drop-in replacement for RN's `TextInput` that hardcodes
 * `allowFontScaling={false}` (covers both typed and placeholder text). Must
 * be used instead of bare `<TextInput>` everywhere in the app.
 */
import { TextInput, TextInputProps } from 'react-native';

type AppTextInputProps = TextInputProps & {
  testId?: string;
};

const AppTextInput = (props: AppTextInputProps) => {
  return (
    <TextInput {...props} testID={props.testId} allowFontScaling={false} />
  );
};

export default AppTextInput;
