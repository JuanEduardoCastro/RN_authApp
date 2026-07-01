import React from 'react';

import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { UserSummary } from '@store/types';

import AppText from '@components/shared/appsComps/AppText';
import AppTextInput from '@components/shared/appsComps/AppTextInput';
import Button from '@components/shared/appsComps/AppButton';
import Separator from '@components/shared/Separator';

import useStyles from '@hooks/useStyles';

import { moderateScale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

type MessageBlockProps = {
  users: UserSummary[];
  selectedIds: Set<string>;
  title: string;
  setTitle: (value: string) => void;
  body: string;
  setBody: (value: string) => void;
  typeOptions: { key: MessageType; i18nKey: string }[];
  messageType: MessageType;
  setMessageType: (type: MessageType) => void;
  handleSend: () => void;
  isFormValid: boolean;
  loader: boolean;
};

export type MessageType = 'push' | 'in_app' | 'both';

const MessageBlock = ({
  users,
  selectedIds,
  title,
  setTitle,
  body,
  setBody,
  typeOptions,
  messageType,
  setMessageType,
  handleSend,
  isFormValid,
  loader,
}: MessageBlockProps) => {
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* pagination spinner */}
      {loader && users.length > 0 && (
        <ActivityIndicator color={colors.second} style={styles.pageLoader} />
      )}

      <Separator borderWidth={0.5} height={32} />

      {/* compose form */}
      <View style={styles.formSection}>
        <View style={styles.inputBlock}>
          <AppTextInput
            style={styles.inputField}
            value={title}
            onChangeText={setTitle}
            placeholder={t('admin-title-placeholder')}
            placeholderTextColor={colors.lightgray}
            maxLength={100}
            autoCapitalize="sentences"
          />
          <AppText style={styles.charCount}>{title.length}/100</AppText>
        </View>
        <View style={styles.inputBlock}>
          <AppTextInput
            style={[styles.inputField, styles.bodyField]}
            value={body}
            onChangeText={setBody}
            placeholder={t('admin-body-placeholder')}
            placeholderTextColor={colors.lightgray}
            maxLength={1000}
            multiline
            numberOfLines={4}
            autoCapitalize="sentences"
            textAlignVertical="top"
          />

          <AppText style={styles.charCount}>{body.length}/1000</AppText>
        </View>

        {/* message type selector */}
        <View style={styles.typeRow}>
          {typeOptions.map(({ key, i18nKey }) => (
            <Pressable
              key={key}
              onPress={() => setMessageType(key)}
              style={[
                styles.typeButton,
                messageType === key && styles.typeButtonActive,
              ]}>
              <AppText
                style={[
                  styles.typeButtonText,
                  messageType === key && styles.typeButtonTextActive,
                ]}>
                {t(i18nKey)}{' '}
              </AppText>
            </Pressable>
          ))}
        </View>

        <Separator border={false} height={16} />

        <Button
          title={t('admin-send-button', { count: selectedIds.size })}
          onPress={handleSend}
          disabled={!isFormValid || loader}
          textStyles={{ color: colors.textNgt }}
        />
      </View>

      <Separator border={false} height={80} />
    </View>
  );
};

export default MessageBlock;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      width: '100%',
      paddingHorizontal: moderateScale(16),
    },
    text: {},

    pageLoader: {
      marginVertical: moderateScale(12),
    },
    pressed: {
      opacity: 0.7,
    },

    selectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: moderateScale(8),
    },
    selectAllText: {
      ...textVar.base,
      color: colors.second,
    },
    selectionCount: {
      ...textVar.small,
      color: colors.textMuted,
    },
    formSection: {
      gap: moderateScale(8),
    },
    inputBlock: {
      gap: 4,
    },
    inputField: {
      borderWidth: 1,
      borderColor: colors.base,
      borderRadius: 8,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(10),
      ...textVar.base,
      color: colors.text,
    },
    bodyField: {
      height: SCREEN.heightFixed * 110,
      paddingTop: moderateScale(10),
    },
    charCount: {
      ...textVar.small,
      color: colors.textMuted,
      textAlign: 'right',
    },
    typeRow: {
      flexDirection: 'row',
      gap: moderateScale(8),
    },
    typeButton: {
      flex: 1,
      height: SCREEN.heightFixed * 40,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.base,
      justifyContent: 'center',
      alignItems: 'center',
    },
    typeButtonActive: {
      backgroundColor: colors.second,
      borderColor: colors.second,
    },
    typeButtonText: {
      ...textVar.small,
      color: colors.textMuted,
    },
    typeButtonTextActive: {
      color: colors.textNgt,
    },
  });
