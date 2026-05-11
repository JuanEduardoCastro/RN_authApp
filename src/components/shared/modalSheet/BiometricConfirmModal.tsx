import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import useStyles from '@hooks/useStyles';

import { moderateScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import Button from '../Button';
import Separator from '../Separator';

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
    <View style={styles.containerModal}>
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
      <Separator border={false} height={40} />
      <View style={styles.buttonBox}>
        <Button
          title={t('biometric-confirm-cancel')}
          onPress={toggleModalSheet}
          style={styles.buttonSize}
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
          style={styles.buttonSize}
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
    containerModal: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
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
      lineHeight: moderateScale(28),
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
    noButton: {
      width: '100%',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.second,
    },
    noButtonText: {
      ...textVar.medium,
      color: colors.text,
    },
    yesButton: {
      width: '100%',
      borderWidth: 0,
      backgroundColor: colors.second,
    },
    yesButtonText: {
      ...textVar.medium,
      color: colors.textNgt,
    },
  });
