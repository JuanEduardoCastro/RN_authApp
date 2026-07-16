/**
 * AdminScreen
 * Superadmin-only screen for composing and sending push/in-app/both
 * messages to selected users, backed by a debounced, paginated,
 * searchable user list (`fetchUsers`) and `sendAdminMessage`.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resetUsers, userAdmin } from '@store/adminSlice';
import { setNotificationMessage } from '@store/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUsers, sendAdminMessage } from '@store/thunks';
import { UserSummary } from '@store/types';

import { SettingsStackScreenProps } from '@navigation/types';

import MessageBlock, {
  MessageType,
} from '@components/adminMessages/MessageBlock';
import SearchBox from '@components/adminMessages/SearchBox';
import AppText from '@components/shared/appsComps/AppText';
import HeaderGoBack from '@components/shared/HeaderGoBack';

import useStyles from '@hooks/useStyles';

import { CheckIcon } from '@assets/svg/icons';

import { moderateScale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

const TYPE_OPTIONS: { key: MessageType; i18nKey: string }[] = [
  { key: 'push', i18nKey: 'admin-type-push' },
  { key: 'in_app', i18nKey: 'admin-type-in-app' },
  { key: 'both', i18nKey: 'admin-type-both' },
];

const AdminScreen = ({
  navigation,
}: SettingsStackScreenProps<'AdminScreen'>) => {
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { users, loader, usersHasMore, usersPage } = useAppSelector(userAdmin);

  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('in_app');

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dispatch(resetUsers());
    dispatch(fetchUsers({ t, page: 1, search: '' }));

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      dispatch(resetUsers());
      dispatch(fetchUsers({ t, page: 1, search: text }));
    }, 300);
  };

  const toggleUser = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const allLoaded = users.map(u => u._id);
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allLoaded));
    }
  };

  const handleLoadMore = () => {
    if (!loader && usersHasMore) {
      dispatch(fetchUsers({ t, page: usersPage + 1, search }));
    }
  };

  const handleSend = async () => {
    if (selectedIds.size === 0 || !title.trim() || !body.trim()) {
      dispatch(
        setNotificationMessage({
          messageType: 'warning',
          notificationMessage: t('admin-send-warning'),
        }),
      );
      return;
    }
    Keyboard.dismiss();
    try {
      await dispatch(
        sendAdminMessage({
          t,
          recipientIds: [...selectedIds],
          title: title.trim(),
          body: body.trim(),
          type: messageType,
        }),
      ).unwrap();
      dispatch(
        setNotificationMessage({
          messageType: 'success',
          notificationMessage: t('admin-send-success'),
        }),
      );
      setSelectedIds(new Set());
      setTitle('');
      setBody('');
    } catch (error) {
      __DEV__ &&
        console.log('XX -> AdminScreen.tsx:84 -> handleSend -> error :', error);
    }
  };

  const allSelected = users.length > 0 && selectedIds.size === users.length;
  const isFormValid =
    selectedIds.size > 0 && title.trim().length > 0 && body.trim().length > 0;

  const renderItem = useCallback(
    ({ item }: { item: UserSummary }) => {
      const isSelected = selectedIds.has(item._id);
      return (
        <Pressable
          onPress={() => toggleUser(item._id)}
          style={({ pressed }) => [styles.userRow, pressed && styles.pressed]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}>
          <View style={styles.userInfo}>
            <AppText style={styles.userName}>
              {item.firstName} {item.lastName}
            </AppText>
            <AppText style={styles.userEmail}>{item.email}</AppText>
          </View>
          <View
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            <CheckIcon width={16} height={16} color={colors.textNgt} />
          </View>
        </Pressable>
      );
    },
    [selectedIds, styles, colors],
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderGoBack onPress={() => navigation.goBack()} />
      <SearchBox
        search={search}
        handleSearch={handleSearch}
        allSelected={allSelected}
        selectedIds={selectedIds}
        handleSelectAll={handleSelectAll}
      />
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          !loader ? (
            <AppText style={styles.emptyText}>{t('no-users-found')}</AppText>
          ) : (
            <ActivityIndicator
              color={colors.second}
              style={styles.pageLoader}
            />
          )
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      />
      <MessageBlock
        users={users}
        selectedIds={selectedIds}
        title={title}
        setTitle={setTitle}
        body={body}
        setBody={setBody}
        typeOptions={TYPE_OPTIONS}
        messageType={messageType}
        setMessageType={setMessageType}
        handleSend={handleSend}
        isFormValid={isFormValid}
        loader={loader}
      />
    </SafeAreaView>
  );
};

export default AdminScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    listContent: {
      width: SCREEN.contentWidth,
      paddingHorizontal: moderateScale(16),
      paddingBottom: moderateScale(16),
    },

    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: moderateScale(8),
      paddingHorizontal: moderateScale(4),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.base,
      gap: moderateScale(12),
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      ...textVar.baseBold,
      color: colors.text,
    },
    userEmail: {
      ...textVar.small,
      color: colors.textMuted,
    },
    checkbox: {
      justifyContent: 'center',
      alignItems: 'center',
      width: SCREEN.widthFixed * 20,
      height: SCREEN.widthFixed * 20,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: colors.base,
      marginRight: moderateScale(6),
    },
    checkboxSelected: {
      backgroundColor: colors.second,
      borderColor: colors.second,
    },
    pressed: {
      opacity: 0.7,
    },
    pageLoader: {
      marginVertical: moderateScale(12),
    },
    emptyText: {
      ...textVar.base,
      color: colors.textMuted,
      textAlign: 'center',
      paddingVertical: moderateScale(20),
    },
  });
