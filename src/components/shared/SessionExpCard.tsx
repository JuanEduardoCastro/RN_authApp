import { moderateScale, SCREEN, verticalScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@store/hooks';
import { userAuth } from '@store/authSlice';
import { jwtDecode } from 'jwt-decode';

const SessionExpCard = () => {
  const { styles } = useStyles(createStyles);
  const { token, user } = useAppSelector(userAuth);

  const { t, i18n } = useTranslation();

  const sessionInfo = useMemo(() => {
    if (!token) return;
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      const msRemaining = exp * 1000 - Date.now();
      const localeMap: Record<string, string> = {
        en: 'en-US',
        es: 'es-ES',
      };
      const locale = localeMap[i18n.language] || 'en-US';
      const expiresAt = new Date(exp * 1000).toLocaleDateString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      });
      return { expiresAt, isExpiringSoon: msRemaining < 5 * 60 * 1000 };
    } catch (error) {
      return { expiresAt: '', isExpiringSoon: false };
    }
  }, [token, i18n.language]);

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <View style={styles.sessionExpBox}>
          <Text style={styles.titleText}>{t('session-expires-at')}: </Text>
          <Text style={styles.timeText}>{sessionInfo?.expiresAt}</Text>
        </View>
      </View>
    </View>
  );
};

export default SessionExpCard;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundCard,
      width: SCREEN.width90,
      paddingVertical: verticalScale(16),
      paddingHorizontal: moderateScale(16),
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.second + 66,
      gap: moderateScale(24),
    },
    sessionExpBox: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 4,
      // padding: moderateScale(8),
    },
    infoBox: {
      // padding: moderateScale(8),
      gap: 4,
    },
    userNameBox: {},
    titleText: {
      ...textVar.base,
      color: colors.text,
    },
    timeText: {
      ...textVar.baseBold,
      color: colors.text,
      letterSpacing: 0.2,
    },
  });
