/**
 * MessageCard
 * Inbox list-item card: sender, date, title (highlighted + unread dot when
 * unread), and a 2-line-clamped expandable body. Supports swipe-left-to-
 * reveal-delete via a custom Reanimated pan gesture, enabled only when
 * `onDeletePress` is passed (i.e. only for already-read messages).
 */
import React from 'react';

import { Pressable, StyleSheet, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { InboxMessage } from '@store/types';

import useStyles from '@hooks/useStyles';

import { TrashCanIcon } from '@assets/svg/icons';

import { moderateScale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import AppText from './appsComps/AppText';

const DELETE_ACTION_WIDTH = 160;

type MessageCardProps = {
  item: InboxMessage;
  isExpanded: boolean;
  onPress: () => void;
  onDeletePress?: () => void;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const MessageCard = ({
  item,
  isExpanded,
  onPress,
  onDeletePress,
}: MessageCardProps) => {
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();

  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const senderName =
    item.isSystemMessage || !item.sender
      ? t('inbox-system-sender')
      : `${item.sender.firstName} ${item.sender.lastName}`;

  const pan = Gesture.Pan()
    .enabled(!!onDeletePress)
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate(e => {
      const next = startX.value + e.translationX * 0.4;
      translateX.value = Math.min(0, Math.max(next, -DELETE_ACTION_WIDTH));
    })
    .onEnd(e => {
      const shouldOpen =
        translateX.value < -DELETE_ACTION_WIDTH * 0.5 || e.velocityX < -300;
      translateX.value = withSpring(shouldOpen ? -DELETE_ACTION_WIDTH : 0);
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const actionStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-DELETE_ACTION_WIDTH, 0], [1, 0]),
  }));

  const handleDeletePress = () => {
    translateX.value = withSpring(0);
    onDeletePress?.();
  };

  return (
    <View style={styles.swipeableContainer}>
      {onDeletePress && (
        <Animated.View style={[styles.deleteAction, actionStyle]}>
          <Pressable onPress={handleDeletePress} style={styles.deleteButton}>
            <AppText style={styles.deleteText}>
              {t('delete-message-action')}
            </AppText>
            <TrashCanIcon width={17} height={17} color={colors.almostWhite} />
          </Pressable>
        </Animated.View>
      )}
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Pressable
            onPress={onPress}
            style={({ pressed }) => [
              styles.container,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityState={{ checked: isExpanded }}>
            {/* row 1: sender + date */}
            <View style={styles.headerRow}>
              <AppText style={styles.senderText} numberOfLines={1}>
                {senderName}
              </AppText>
              <AppText style={styles.dateText}>
                {formatDate(item.createdAt)}
              </AppText>
            </View>

            {/* row 2: title + unread dot */}
            <View style={styles.titleRow}>
              <AppText
                style={[styles.titleText, !item.isRead && styles.titleUnread]}
                numberOfLines={1}>
                {item.title}
              </AppText>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>

            {/* row 3: body preview */}

            {/* <View style={styles.bodyRow}> */}
            <AppText
              style={styles.bodyText}
              numberOfLines={isExpanded ? undefined : 2}>
              {item.body}
            </AppText>
            {/* </View> */}
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default MessageCard;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    swipeableContainer: {
      overflow: 'hidden',
      backgroundColor: colors.background,
    },
    card: {
      backgroundColor: colors.background,
    },
    container: {
      paddingVertical: moderateScale(12),
      paddingHorizontal: moderateScale(8),
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

    deleteAction: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: DELETE_ACTION_WIDTH,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.danger,
      borderRadius: 2,
      // boxShadow: 'inset 2px 1px 8px rgba(0, 0, 0, 0.6)',
    },
    deleteButton: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: moderateScale(6),
    },
    deleteText: {
      ...textVar.mediumBold,
      color: colors.almostWhite,
      letterSpacing: 0.6,
    },
  });
