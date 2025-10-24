import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { textVar } from '@constants/textVar';
import { SCREEN } from '@constants/sizes';

type InfoPasswordModalProps = {
  toggleModalSheet: () => void;
};

const InfoPasswordModal = ({ toggleModalSheet }: InfoPasswordModalProps) => {
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.modalTextBox}>
        <Text style={styles.modalTitle}>{t('info-password-message')}</Text>
        <Text style={styles.modalText}>{t('info-password-length')}</Text>
        <Text style={styles.modalText}>{t('info-password-uppercase')}</Text>
        <Text style={styles.modalText}>{t('info-password-lowercase')}</Text>
        <Text style={styles.modalText}>{t('info-password-number')}</Text>
        <Text style={styles.modalText}>{t('info-password-symbol')}</Text>
      </View>
      <View style={styles.buttonBox}>
        <Button
          title={t('info-accept')}
          onPress={toggleModalSheet}
          buttonStyles={styles.acceptButton}
          textStyles={styles.textButton}
        />
      </View>
    </View>
  );
};

export default InfoPasswordModal;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      // backgroundColor: 'lightgray',
      gap: 20,
      paddingHorizontal: 10,
    },
    modalTitle: {
      ...textVar.baseBold,
      color: colors.text,
      textAlign: 'center',
      paddingBottom: 8,
    },
    modalTextBox: {
      // backgroundColor: 'lightgray',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 2,
    },
    modalText: {
      ...textVar.medium,
      color: colors.text,
      textAlign: 'center',
    },
    buttonBox: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    acceptButton: {
      minWidth: SCREEN.widthFixed * 77,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.second,
    },
    textButton: {
      ...textVar.base,
      color: colors.text,
    },
  });
