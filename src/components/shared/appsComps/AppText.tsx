import { Text, TextProps } from 'react-native';

const AppText = (props: TextProps) => {
  return <Text {...props} allowFontScaling={false} />;
};

export default AppText;
