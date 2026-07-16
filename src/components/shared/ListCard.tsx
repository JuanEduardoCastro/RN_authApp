/**
 * ListCard
 * Generic pressable list row with an optional leading icon, a title, and an
 * optional trailing checkmark. Used throughout `SettingsScreen`/`AdminScreen`
 * for navigable/selectable list items.
 */
import React, { ReactNode } from 'react';

import { Pressable, StyleSheet, View } from 'react-native';

import useStyles from '@hooks/useStyles';

import { CheckIcon } from '@assets/svg/icons';

import { moderateScale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import AppText from './appsComps/AppText';

type ListCardProps = {
  title: string;
  onPress?: () => void;
  icon?: ReactNode;
  checkBox?: boolean;
};

const ListCard = ({
  title,
  onPress,
  icon,
  checkBox = false,
}: ListCardProps) => {
  const { colors, styles } = useStyles(createStyles);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button">
      <View style={styles.iconBox}>{icon}</View>
      <AppText style={styles.text}>{title}</AppText>
      <View style={styles.checkBox}>
        {checkBox && <CheckIcon width={14} height={14} color={colors.second} />}
      </View>
    </Pressable>
  );
};

export default ListCard;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: SCREEN.heightFixed * 46,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: moderateScale(10),
      marginVertical: 4,
    },
    iconBox: {
      width: SCREEN.widthFixed * 24,
      height: SCREEN.heightFixed * 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: moderateScale(12),
    },
    text: {
      ...textVar.base,
      color: colors.text,
      flex: 1,
    },
    checkBox: {
      width: SCREEN.widthFixed * 24,
      alignItems: 'flex-end',
    },
    pressed: {
      opacity: 0.7,
    },
  });
