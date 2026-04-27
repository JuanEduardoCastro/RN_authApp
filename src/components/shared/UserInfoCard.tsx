import { moderateScale, SCREEN, verticalScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AvatarView from './AvatarView';
import { User } from '@store/types';
import { useTranslation } from 'react-i18next';

type UserInfoCardProps = {
  user: User;
};

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  const { colors, styles } = useStyles(createStyles);
  const { i18n } = useTranslation();

  const memberSinceFormat = (dateString: string | Date) => {
    if (!dateString) return '';
    const localeMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
    };
    const locale = localeMap[i18n.language] || 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.userCard}>
      <View style={styles.avatarBox}>
        <AvatarView name="avatarURL" />
      </View>
      <View style={styles.infoBox}>
        <View style={styles.userNameBox}>
          <Text style={styles.userNameText}>
            {user?.firstName + ' ' + user?.lastName}
          </Text>
        </View>
        <View style={styles.emaileBox}>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
        <View style={styles.memberSinceBox}>
          <Text style={styles.memberSinceText}>
            {memberSinceFormat(user!.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserInfoCard;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    userCard: {
      backgroundColor: colors.backgroundCard,
      flexDirection: 'row',
      width: SCREEN.width90,
      paddingVertical: verticalScale(16),
      paddingHorizontal: moderateScale(16),
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.second + 66,
      gap: moderateScale(24),
    },
    avatarBox: {
      justifyContent: 'center',
      alignItems: 'center',
      // padding: moderateScale(8),
    },
    infoBox: {
      // padding: moderateScale(8),
      gap: 4,
    },
    userNameBox: {},
    userNameText: {
      ...textVar.xlargeBold,
      color: colors.text,
    },
    emaileBox: {},
    emailText: {
      ...textVar.base,
      color: colors.textMuted,
    },
    memberSinceBox: {},
    memberSinceText: {
      ...textVar.medium,
      color: colors.textMuted,
    },
  });
