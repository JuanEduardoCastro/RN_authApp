/**
 * InfoPasswordModal
 * Static informational modal listing the password rules (length, case,
 * number, symbol). Opened from the "ⓘ" button next to password fields in
 * InputAuthField.
 */
import React from 'react';

import { StyleSheet, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import useStyles from '@hooks/useStyles';

import { moderateScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import Button from '../appsComps/AppButton';
import AppText from '../appsComps/AppText';
import Separator from '../Separator';

type InfoPasswordModalProps = {
  toggleModalSheet: () => void;
};

const InfoPasswordModal = ({ toggleModalSheet }: InfoPasswordModalProps) => {
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.containerModal}>
      <View style={styles.modalTextBox}>
        <AppText style={styles.modalTitle}>
          {t('info-password-message')}
        </AppText>
        <AppText style={styles.modalText}>{t('info-password-length')}</AppText>
        <AppText style={styles.modalText}>
          {t('info-password-uppercase')}
        </AppText>
        <AppText style={styles.modalText}>
          {t('info-password-lowercase')}
        </AppText>
        <AppText style={styles.modalText}>{t('info-password-number')}</AppText>
        <AppText style={styles.modalText}>{t('info-password-symbol')}</AppText>
      </View>
      <Separator border={false} height={30} />
      <View style={styles.buttonBox}>
        <Button
          title={t('info-accept')}
          onPress={toggleModalSheet}
          style={styles.buttonSize}
          buttonStyles={styles.yesButton}
          textStyles={styles.yesTextButton}
        />
      </View>
    </View>
  );
};

export default InfoPasswordModal;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    containerModal: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTextBox: {
      // backgroundColor: 'blue',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 2,
    },
    modalTitle: {
      ...textVar.baseBold,
      color: colors.text,
      textAlign: 'center',
      paddingBottom: 8,
    },
    modalText: {
      ...textVar.medium,
      color: colors.text,
      textAlign: 'center',
    },
    buttonBox: {
      width: '50%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      gap: moderateScale(22),
      paddingHorizontal: moderateScale(20),
    },
    buttonSize: {
      flex: 1,
    },
    yesButton: {
      width: '100%',
      borderWidth: 0,
      backgroundColor: colors.second,
    },
    yesTextButton: {
      ...textVar.base,
      color: colors.textNgt,
    },
  });
