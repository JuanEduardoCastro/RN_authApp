import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { User } from '@store/types';

import useStyles from '@hooks/useStyles';

import { moderateScale, SCREEN, verticalScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import AvatarView from './AvatarView';

type UserInfoCardProps = {
  user: User;
  onPress?: () => void;
};

const UserInfoCard = ({ user, onPress }: UserInfoCardProps) => {
  const { styles } = useStyles(createStyles);
  const { i18n, t } = useTranslation();

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
    <Pressable onPress={onPress} style={styles.userCard}>
      <View style={styles.avatarBox}>
        <AvatarView name="avatarURL" />
      </View>
      <View style={styles.infoBox}>
        <View style={styles.userNameBox}>
          <Text
            style={styles.userNameText}
            ellipsizeMode="tail"
            numberOfLines={1}>
            {(user?.firstName.length ?? 0) > 0
              ? user?.firstName + ' ' + user?.lastName
              : t('default-user-name')}
          </Text>
        </View>
        <View style={styles.emaileBox}>
          <Text style={styles.emailText} ellipsizeMode="tail" numberOfLines={1}>
            {user?.email}
          </Text>
        </View>
        <View style={styles.memberSinceBox}>
          <Text style={styles.memberSinceText}>
            {memberSinceFormat(user!.createdAt)}
          </Text>
        </View>
      </View>
    </Pressable>
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
      overflow: 'hidden',
    },
    avatarBox: {
      justifyContent: 'center',
      alignItems: 'center',
      // padding: moderateScale(8),
    },
    infoBox: {
      flex: 1,
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
