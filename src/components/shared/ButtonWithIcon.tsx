import {
  View,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React, { ElementType } from 'react';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import useStyles from '@hooks/useStyles';

type ButtonWithIconProps = {
  title?: string;
  buttonStyles?: ViewStyle;
  textStyles?: TextStyle;
  Icon?: ElementType | undefined;
  iconProps?: { width?: number; height?: number };
  atPosition?: 'column' | 'row' | 'column-reverse' | 'row-reverse';
} & PressableProps;

const ButtonWithIcon = ({
  title = 'Go to',
  buttonStyles,
  textStyles,
  Icon,
  iconProps,
  atPosition = 'row',
  ...props
}: ButtonWithIconProps) => {
  const { colors, styles } = useStyles(createStyles);

  return (
    <Pressable
      style={[styles.button, buttonStyles, { flexDirection: atPosition }]}
      {...props}>
      {Icon && (
        <View style={styles.iconBox}>
          <Icon {...iconProps} />
        </View>
      )}
      <Text style={[styles.text, textStyles]}>{title}</Text>
    </Pressable>
  );
};

export default ButtonWithIcon;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    button: {
      maxWidth: SCREEN.width100,
      height: SCREEN.heightFixed * 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 12,
    },
    iconBox: {
      // justifyContent: 'center',
      // alignItems: 'center',
      // backgroundColor: 'gray',
      // width: 24,
      // height: 24,
    },
    text: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: 16,
    },
  });
