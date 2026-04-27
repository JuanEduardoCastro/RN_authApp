import { AppleIcon, GithubIcon, GoogleIcon, MailIcon } from '@assets/svg/icons';
import { scale, SCREEN, verticalScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import { userAuth } from '@store/authSlice';
import { useAppSelector } from '@store/hooks';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type HeaderHomeProps = {
  toggleModalSheet: () => void;
};

const HeaderHome = ({ toggleModalSheet }: HeaderHomeProps) => {
  const { styles } = useStyles(createStyles);
  const { user } = useAppSelector(userAuth);

  const selectUserProvider = () => {
    if (user !== null) {
      switch (user.provider) {
        case 'google':
          return (
            <GoogleIcon
              width={SCREEN.widthFixed * 20}
              height={SCREEN.heightFixed * 20}
            />
          );
        case 'github':
          return (
            <GithubIcon
              width={SCREEN.widthFixed * 20}
              height={SCREEN.heightFixed * 20}
            />
          );
        case 'apple':
          return (
            <AppleIcon
              width={SCREEN.widthFixed * 20}
              height={SCREEN.heightFixed * 20}
            />
          );

        default:
          return (
            <MailIcon
              width={SCREEN.widthFixed * 20}
              height={SCREEN.heightFixed * 20}
            />
          );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftHeader}></View>
      <View style={styles.centerHeader}>
        <Text style={styles.text}>Login from: </Text>
      </View>
      <Pressable
        // onPress={() => console.log('hizo click')}
        // onPress={() => toggleModalSheet()}
        style={styles.rightHeader}>
        {selectUserProvider()}
      </Pressable>
    </View>
  );
};

export default HeaderHome;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      height: verticalScale(54),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: scale(16),
    },
    leftHeader: {
      flexGrow: 1,
      alignItems: 'flex-start',
      padding: 8,
    },
    centerHeader: {
      flexGrow: 2,
      alignItems: 'flex-end',
      padding: 8,
    },
    rightHeader: {
      flexGrow: 1,
      alignItems: 'flex-start',
      padding: 8,
    },
    text: {
      ...textVar.base,
      color: colors.text,
    },
  });
