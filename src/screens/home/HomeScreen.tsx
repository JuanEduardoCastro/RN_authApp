import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useMode } from '@context/ThemeContext';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import Separator from '@components/shared/Separator';
import ModeSwitchButton from '@components/shared/ModeSwitchButton';

const HomeScreen = () => {
  const { mode, toggleMode } = useMode();
  const { colors, styles } = useStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>HomeScreen</Text>
      <Separator border={false} />
      <ModeSwitchButton />
    </View>
  );
};

export default HomeScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: colors.text,
      fontSize: 20,
    },
  });
