import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import { SCREEN } from '@constants/sizes';
import { CheckIcon } from '@assets/svg/icons';

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
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.cardBox}>
        <View style={styles.iconBox}>{icon && icon}</View>
        <Text style={styles.text}>{title} </Text>
      </View>
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
      // height: SCREEN.heightFixed * 46,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      // gap: 12,
      // marginVertical: 4,
    },
    cardBox: {
      flexDirection: 'row',
      height: SCREEN.heightFixed * 46,
      justifyContent: 'flex-start',
      alignItems: 'center',
      // paddingHorizontal: 10,
      gap: 12,
      marginVertical: 4,
    },
    iconBox: {
      width: SCREEN.widthFixed * 24,
      height: SCREEN.heightFixed * 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: colors.text,
      fontSize: 16,
    },
    checkBox: {},
  });
