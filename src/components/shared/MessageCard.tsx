import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { InboxMessage } from '@store/types';

import useStyles from '@hooks/useStyles';

import { moderateScale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

type MessageCardProps = {
  item: InboxMessage;
  isExpanded: boolean;
  onPress: () => void;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const MessageCard = ({ item, isExpanded, onPress }: MessageCardProps) => {
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();

  const senderName =
    item.isSystemMessage || !item.sender
      ? t('inbox-system-sender')
      : `${item.sender.firstName} ${item.sender.lastName}`;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityState={{ checked: isExpanded }}>
      {/* row 1: sender + date */}
      <View style={styles.headerRow}>
        <Text style={styles.senderText} numberOfLines={1}>
          {senderName}
        </Text>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>

      {/* row 2: title + unread dot */}
      <View style={styles.titleRow}>
        <Text
          style={[styles.titleText, !item.isRead && styles.titleUnread]}
          numberOfLines={1}>
          {item.title}
        </Text>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>

      {/* row 3: body preview */}

      {/* <View style={styles.bodyRow}> */}
      <Text style={styles.bodyText} numberOfLines={isExpanded ? undefined : 2}>
        {item.body}
      </Text>
      {/* </View> */}
    </Pressable>
  );
};

export default MessageCard;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      paddingVertical: moderateScale(12),
      gap: moderateScale(4),
    },
    pressed: {
      opacity: 0.7,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: moderateScale(8),
    },
    senderText: {
      ...textVar.small,
      color: colors.textMuted,
      flex: 1,
    },
    dateText: {
      ...textVar.small,
      color: colors.textMuted,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(6),
    },
    titleText: {
      ...textVar.baseBold,
      color: colors.text,
      flex: 1,
    },
    titleUnread: {
      color: colors.second,
    },
    unreadDot: {
      width: SCREEN.widthFixed * 8,
      height: SCREEN.widthFixed * 8,
      borderRadius: 4,
      backgroundColor: colors.second,
    },
    bodyText: {
      ...textVar.medium,
      color: colors.textMuted,
    },
  });
