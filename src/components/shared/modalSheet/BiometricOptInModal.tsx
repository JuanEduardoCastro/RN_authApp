import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import * as Keychain from 'react-native-keychain';
import Button from '../Button';
import { scale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';

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
    <View style={styles.container}>
      <Text style={styles.title}>{t('biometric-optin-title')}</Text>
      <Text style={styles.message}>
        {isFaceId
          ? t('biometric-optin-message-face-id')
          : t('biometric-optin-message-touch-id')}
      </Text>
      <View style={styles.buttonBox}>
        <Button
          title={t('biometric-optin-no')}
          onPress={onDecline}
          buttonStyles={styles.noButton}
          textStyles={styles.noButtonText}
        />
        <Button
          title={t('biometric-optin-yes')}
          onPress={onEnable}
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
      ...textVar.base,
      color: colors.text,
    },
    yesButton: {},
    yesButtonText: {
      color: colors.textNgt,
    },
  });
