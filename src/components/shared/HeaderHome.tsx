/**
 * HeaderHome
 * Header shown on `HomeScreen` displaying which auth provider the current
 * session used ("Signed in from Google/GitHub/Apple/email") with a matching
 * icon. Reads `user.provider` from the Redux `userAuth` selector.
 */
import React from 'react';

import { StyleSheet, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { userAuth } from '@store/authSlice';
import { useAppSelector } from '@store/hooks';

import useStyles from '@hooks/useStyles';

import { AppleIcon, GithubIcon, GoogleIcon, MailIcon } from '@assets/svg/icons';

import { moderateScale, SCREEN, verticalScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import AppText from './appsComps/AppText';

type HeaderHomeProps = {
  toggleModalSheet: () => void;
};

const HeaderHome = ({
  toggleModalSheet: _toggleModalSheet,
}: HeaderHomeProps) => {
  const { colors, styles } = useStyles(createStyles);
  const { user } = useAppSelector(userAuth);
  const { t } = useTranslation();

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
              color={colors.second}
            />
          );
        case 'apple':
          return (
            <AppleIcon
              width={SCREEN.widthFixed * 20}
              height={SCREEN.heightFixed * 20}
              color={colors.second}
            />
          );

        default:
          return (
            <MailIcon
              width={SCREEN.widthFixed * 22}
              height={SCREEN.heightFixed * 22}
              color={colors.second}
            />
          );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerHeader}>
        <AppText style={styles.text}>
          {t('login-from')} {user?.provider ?? 'email'}{' '}
        </AppText>
      </View>
      <View style={styles.rightHeader}>{selectUserProvider()}</View>
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
      paddingHorizontal: moderateScale(16),
    },
    leftHeader: {
      alignItems: 'flex-start',
      padding: 8,
    },
    centerHeader: {
      alignItems: 'flex-end',
      padding: 8,
    },
    rightHeader: {
      alignItems: 'flex-start',
      padding: 8,
    },
    text: {
      ...textVar.baseBold,
      color: colors.text,
    },
  });
