import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import * as Keychain from 'react-native-keychain';

import useStyles from '@hooks/useStyles';

import { moderateScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import Button from '../Button';
import Separator from '../Separator';

type BiometricOptInModalProps = {
  biometricType: Keychain.BIOMETRY_TYPE | null;
  onEnable: () => Promise<void>;
  onDecline: () => void;
};

const BiometricOptInModal = ({
  biometricType,
  onEnable,
  onDecline,
}: BiometricOptInModalProps) => {
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();

  const isFaceId = biometricType === Keychain.BIOMETRY_TYPE.FACE_ID;

  return (
    <View style={styles.containerModal}>
      <Text style={styles.title}>{t('biometric-optin-title')}</Text>
      <Text style={styles.message}>
        {isFaceId
          ? t('biometric-optin-message-face-id')
          : t('biometric-optin-message-touch-id')}
      </Text>
      <Separator border={false} height={40} />
      <View style={styles.buttonBox}>
        <Button
          title={t('biometric-optin-no')}
          onPress={onDecline}
          style={styles.buttonSize}
          buttonStyles={styles.noButton}
          textStyles={styles.noButtonText}
        />
        <Button
          title={t('biometric-optin-yes')}
          onPress={onEnable}
          style={styles.buttonSize}
          buttonStyles={styles.yesButton}
          textStyles={styles.yesButtonText}
        />
      </View>
    </View>
  );
};

export default BiometricOptInModal;

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
      lineHeight: moderateScale(28),
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
      ...textVar.base,
      color: colors.text,
    },
    yesButton: {
      width: '100%',
      borderWidth: 0,
      backgroundColor: colors.second,
    },
    yesButtonText: {
      ...textVar.base,
      color: colors.textNgt,
    },
  });
