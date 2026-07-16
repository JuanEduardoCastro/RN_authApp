/**
 * DeleteAccountModal
 * Two-step account-deletion confirmation: an initial warning, then a
 * typed-email confirmation step where Delete only enables once the input
 * matches the account's email exactly. Kept separate from ConfirmModal
 * due to this two-step flow and its TextInput.
 */
import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import useStyles from '@hooks/useStyles';

import { QuestionMarkIcon } from '@assets/svg/icons';

import { moderateScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import Button from '../appsComps/AppButton';
import AppText from '../appsComps/AppText';
import AppTextInput from '../appsComps/AppTextInput';
import Separator from '../Separator';

type DeleteAccountModalProps = {
  userEmail: string;
  toggleModalSheet: () => void;
  handleDelete: () => void;
};

const DeleteAccountModal = ({
  userEmail,
  toggleModalSheet,
  handleDelete,
}: DeleteAccountModalProps) => {
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();

  const [typedEmail, setTypedEmail] = useState('');
  const [firstConfirmation, setFirstConfirmation] = useState(true);

  const isConfirmed =
    typedEmail.trim().toLowerCase() === userEmail.toLowerCase();

  const handleFirstConfirmation = () => {
    setFirstConfirmation(false);
  };

  return (
    <View style={styles.containerModal}>
      {firstConfirmation ? (
        <>
          {/* <AppText style={styles.title}>{t('delete-account-title')}</AppText> */}
          <QuestionMarkIcon width={54} height={54} color={colors.danger} />
          <Separator border={false} height={6} />
          <AppText style={styles.warning}>
            {t('delete-account-warning')}
          </AppText>
          <Separator border={false} height={24} />
          <AppText style={styles.warning}>
            {t('delete-account-warning-message')}
          </AppText>
          <Separator border={false} height={32} />
          <View style={styles.buttonBox}>
            <Button
              title={t('delete-account-cancel')}
              onPress={toggleModalSheet}
              style={styles.buttonSize}
              buttonStyles={styles.cancelButton}
              textStyles={styles.cancelTextButton}
            />
            <Button
              title={t('delete-account-cancel-confirm')}
              onPress={handleFirstConfirmation}
              style={styles.buttonSize}
              buttonStyles={styles.yesButton}
              textStyles={styles.yesButtonText}
            />
          </View>
        </>
      ) : (
        <>
          <AppText style={styles.title}>{t('delete-account-title')}</AppText>
          <Separator border={false} height={12} />
          <AppText style={styles.warning}>
            {t('delete-account-instruction')}
          </AppText>
          <Separator border={false} height={24} />
          <AppText style={styles.label}>
            {t('delete-account-email-label')}
          </AppText>
          <Separator border={false} height={8} />
          <AppTextInput
            style={styles.input}
            value={typedEmail}
            onChangeText={setTypedEmail}
            placeholder={userEmail}
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            contextMenuHidden={true}
            selectTextOnFocus={false}
          />
          <Separator border={false} height={32} />
          <View style={styles.buttonBox}>
            <Button
              title={t('delete-account-cancel')}
              onPress={toggleModalSheet}
              style={styles.buttonSize}
              buttonStyles={styles.cancelButton}
              textStyles={styles.cancelTextButton}
            />
            <Button
              title={t('delete-account-confirm-button')}
              onPress={handleDelete}
              disabled={!isConfirmed}
              style={styles.buttonSize}
              buttonStyles={styles.deleteButton}
              textStyles={styles.deleteTextButton}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default DeleteAccountModal;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    containerModal: {
      // flex: 1,
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: moderateScale(2),
    },
    title: {
      ...textVar.largeBold,
      color: colors.text,
      textAlign: 'center',
    },
    warning: {
      ...textVar.base,
      color: colors.text,
      textAlign: 'center',
      lineHeight: moderateScale(24),
    },
    label: {
      ...textVar.small,
      color: colors.text,
      alignSelf: 'flex-start',
    },
    input: {
      ...textVar.base,
      width: '100%',
      borderWidth: 1,
      borderColor: colors.danger,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(10),
      color: colors.text,
    },
    buttonBox: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      gap: moderateScale(22),
      paddingHorizontal: moderateScale(20),
    },
    buttonSize: {
      flex: 1,
    },
    cancelButton: {
      width: '100%',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.second,
    },
    cancelTextButton: {
      ...textVar.base,
      color: colors.text,
    },
    yesButton: {
      width: '100%',
      borderWidth: 0,
      backgroundColor: colors.danger,
    },
    yesButtonText: {
      ...textVar.baseBold,
      color: colors.veryLightGray,
    },
    deleteButton: {
      width: '100%',
      borderWidth: 0,
      backgroundColor: colors.danger,
    },
    deleteButtonDisabled: {
      opacity: 0.4,
    },
    deleteTextButton: {
      ...textVar.baseBold,
      color: colors.veryLightGray,
    },
  });
