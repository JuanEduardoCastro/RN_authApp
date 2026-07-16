/**
 * AppText
 * Drop-in replacement for RN's `Text` that hardcodes `allowFontScaling={false}`
 * so large device accessibility text sizes can't break app layouts. Must be
 * used instead of bare `<Text>` everywhere in the app.
 */
import { Text, TextProps } from 'react-native';

const AppText = (props: TextProps) => {
  return <Text {...props} allowFontScaling={false} />;
};

export default AppText;
