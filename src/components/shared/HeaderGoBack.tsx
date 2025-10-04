import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import { ChevronIcon } from '@assets/svg/icons';
import { textVar } from '@constants/textVar';

type HeaderGoBackProps = {
  title?: string;
  onPress: () => void;
};

const HeaderGoBack = ({ title = '', onPress }: HeaderGoBackProps) => {
  const { colors, styles } = useStyles(createStyles);
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.backIconBox, pressed && styles.pressed]}
        hitSlop={10}
        accessibilityLabel="Go back"
        accessibilityRole="button">
        <ChevronIcon width={20} height={20} color={colors.text} />
      </Pressable>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

export default HeaderGoBack;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      width: SCREEN.width100,
      height: SCREEN.heightFixed * 28,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 2,
      gap: 12,
    },
    backIconBox: {
      transform: [{ rotate: '90deg' }],
      width: SCREEN.widthFixed * 24,
      height: SCREEN.heightFixed * 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.5,
    },
    text: {
      ...textVar.base,
      color: colors.text,
    },
  });
