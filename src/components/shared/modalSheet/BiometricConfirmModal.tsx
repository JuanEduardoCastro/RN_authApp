import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import useStyles from '@hooks/useStyles';

import { scale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import Button from '../Button';

type BiometricConfirmModalProps = {
  action: 'enable' | 'disable';
  toggleModalSheet: () => void;
  onConfirm: () => void;
};

const BiometricConfirmModal = ({
  action,
  toggleModalSheet,
  onConfirm,
}: BiometricConfirmModalProps) => {
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();

  const isEnable = action === 'enable';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEnable
          ? t('biometric-confirm-enable-title')
          : t('biometric-confirm-disable-title')}
      </Text>
      <Text style={styles.message}>
        {isEnable
          ? t('biometric-confirm-enable-message')
          : t('biometric-confirm-disable-message')}
      </Text>
      <View style={styles.buttonBox}>
        <Button
          title={t('biometric-confirm-cancel')}
          onPress={toggleModalSheet}
          buttonStyles={styles.noButton}
          textStyles={styles.noButtonText}
        />
        <Button
          title={
            isEnable
              ? t('biometric-confirm-enable-button')
              : t('biometric-confirm-disable-button')
          }
          onPress={onConfirm}
          buttonStyles={styles.yesButton}
          textStyles={styles.yesButtonText}
        />
      </View>
    </View>
  );
};

export default BiometricConfirmModal;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingHorizontal: scale(26),
      gap: scale(24),
    },
    title: {
      ...textVar.largeBold,
      color: colors.text,
      textAlign: 'center',
    },
    message: {
      ...textVar.base,
      color: colors.textMuted,
      textAlign: 'center',
    },
    buttonBox: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    noButton: {
      backgroundColor: colors.background,
      width: SCREEN.widthFixed * 85,
      borderWidth: 1,
      borderColor: colors.second,
    },
    noButtonText: {
      ...textVar.medium,
      color: colors.text,
    },
    yesButton: {
      backgroundColor: colors.second,
      width: SCREEN.widthFixed * 85,
    },
    yesButtonText: {
      color: colors.textNgt,
    },
  });
