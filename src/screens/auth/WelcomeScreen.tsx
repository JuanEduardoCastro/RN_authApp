import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import Separator from '@components/shared/Separator';
import BGGradient from '@components/shared/BGGradient';
import Button from '@components/shared/Button';

const WelcomeScreen = () => {
  const { colors, styles } = useStyles(createStyles);

  return (
    <BGGradient
      colorInit={colors.base}
      colorEnd={colors.dark}
      angle={160}
      angleCenter={{ x: 0.6, y: 0.9 }}>
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>WELCOME TO AUTH APP</Text>
          <Text style={styles.title}>FOR DEMO OF AUTHORIZATION APP</Text>
          <Separator border={false} height={60} />
          <Text style={styles.subTitle}>Plase login and test the app</Text>
        </View>
        <View style={styles.buttonBox}>
          <Button
            title={'Login'}
            textStyles={{ fontWeight: 600 }}
            onPress={() => console.log('ajaaaaaaa')}
          />
        </View>
      </View>
    </BGGradient>
  );
};

export default WelcomeScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleBox: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: colors.light,
      fontWeight: 700,
      fontSize: 20,
    },
    subTitle: {
      color: colors.light,
      fontWeight: 500,
      fontSize: 18,
    },
    buttonBox: {
      paddingVertical: 12,
      width: 240,
    },
  });
