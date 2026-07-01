import React, { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import notifee from '@notifee/react-native';

import { userAdmin } from '@store/adminSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchMessages, markMessageRead } from '@store/thunks';
import { deleteMessage } from '@store/thunks/adminThunks';
import { InboxMessage } from '@store/types';

import { HomeTabScreenProps } from '@navigation/types';

import HeaderGoBack from '@components/shared/HeaderGoBack';
import MessageCard from '@components/shared/MessageCard';
import ConfirmModal from '@components/shared/modalSheet/ConfirmModal';
import ModalSheet from '@components/shared/modalSheet/ModalSheet';
import Separator from '@components/shared/Separator';

import { useBadgeCount } from '@hooks/useBadgeCount';
import useStyles from '@hooks/useStyles';

import { moderateScale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

const InboxScreen = ({ navigation }: HomeTabScreenProps<'InboxScreen'>) => {
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { clearBadge, syncBadge } = useBadgeCount();

  const { messages, loader } = useAppSelector(userAdmin);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      clearBadge();
      notifee.cancelAllNotifications();
      dispatch(fetchMessages({ t }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const handlePressMessage = useCallback(
    async (item: InboxMessage) => {
      setExpandedId(prev => (prev === item._id ? null : item._id));
      if (!item.isRead) {
        await dispatch(markMessageRead({ t, messageId: item._id })).unwrap();
        syncBadge();
      }
    },
    [dispatch, t, syncBadge],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchMessages({ t }));
    setRefreshing(false);
  }, [dispatch, t]);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessageToDelete(messageId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!messageToDelete) return;
    await dispatch(deleteMessage({ t, messageId: messageToDelete }));
    setMessageToDelete(null);
  }, [dispatch, t, messageToDelete]);

  const handleCancelDelete = useCallback(() => {
    setMessageToDelete(null);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: InboxMessage }) => (
      <MessageCard
        item={item}
        isExpanded={expandedId === item._id}
        onPress={() => handlePressMessage(item)}
        onDeletePress={
          item.isRead ? () => handleDeleteMessage(item._id) : undefined
        }
      />
    ),
    [expandedId, handlePressMessage, handleDeleteMessage],
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <HeaderGoBack onPress={() => navigation.goBack()} />
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>{t('inbox-title')}</Text>
        </View>
        <Separator border={false} height={8} />
        <FlatList
          data={messages}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Separator border height={0} />}
          ListEmptyComponent={
            loader ? (
              <ActivityIndicator color={colors.second} style={styles.loader} />
            ) : (
              <Text style={styles.emptyText}>{t('inbox-empty')}</Text>
            )
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </SafeAreaView>
      {/* Delete message confirmation modal */}
      <ModalSheet
        modalIsVisible={messageToDelete !== null}
        toggleSheet={handleCancelDelete}>
        <ConfirmModal
          message={t('delete-message-confirm')}
          cancelLabel={t('delete-message-cancel')}
          onCancel={handleCancelDelete}
          confirmLabel={t('delete-message-button')}
          onConfirm={handleConfirmDelete}
          confirmDanger
        />
      </ModalSheet>
    </>
  );
};

export default InboxScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    titleBox: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleText: {
      ...textVar.xlargeBold,
      color: colors.text,
    },
    listContent: {
      width: SCREEN.width100,
      paddingHorizontal: moderateScale(8),
      paddingBottom: moderateScale(80),
    },
    messageRow: {
      paddingVertical: moderateScale(12),
      gap: moderateScale(4),
    },
    pressed: {
      opacity: 0.7,
    },
    messageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: moderateScale(8),
    },
    messageSender: {
      ...textVar.small,
      color: colors.textMuted,
      flex: 1,
    },
    messageDate: {
      ...textVar.small,
      color: colors.textMuted,
    },
    messageTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(6),
    },
    messageTitle: {
      flex: 1,
      ...textVar.baseBold,
      color: colors.text,
    },
    messageTitleUnread: {
      color: colors.second,
    },
    unreadDot: {
      width: SCREEN.widthFixed * 8,
      height: SCREEN.widthFixed * 8,
      borderRadius: 4,
      backgroundColor: colors.second,
    },
    messageBody: {
      ...textVar.small,
      color: colors.textMuted,
    },
    loader: {
      marginTop: moderateScale(40),
    },
    emptyText: {
      ...textVar.base,
      color: colors.textMuted,
      textAlign: 'center',
      paddingTop: moderateScale(40),
    },
  });
