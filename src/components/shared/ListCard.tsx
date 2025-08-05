import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode } from 'react';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import { ProfileIcon } from '@assets/svg/icons';
import { SCREEN } from '@constants/sizes';

type ListCardProps = {
  title: string;
  onPress?: () => void;
  icon?: ReactNode;
};

const ListCard = ({ title, onPress, icon }: ListCardProps) => {
  const { colors, styles } = useStyles(createStyles);
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.iconBox}>{icon && icon}</View>
      {/* <ProfileIcon width={24} height={24} color={colors.text} /> */}
      <Text style={styles.text}>{title} </Text>
    </Pressable>
  );
};

export default ListCard;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: SCREEN.heightFixed * 46,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 10,
      borderRadius: 6,
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
  });
