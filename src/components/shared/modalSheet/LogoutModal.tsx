import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import useStyles from '@hooks/useStyles';

import { scale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import Button from '../Button';

type LogoutModalProps = {
  toggleModalSheet: () => void;
  handleLogut: () => void;
};

const LogoutModal = ({ toggleModalSheet, handleLogut }: LogoutModalProps) => {
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.logoutModal}>
      <Text style={styles.modalText}>{t('logout-message')}</Text>
      <View style={styles.buttonBox}>
        <Button
          title={t('logout-cancel')}
          onPress={toggleModalSheet}
          buttonStyles={styles.noButton}
          textStyles={styles.textButton}
        />
        <Button
          title={t('logout-confirmation')}
          onPress={handleLogut}
          buttonStyles={styles.yesButton}
        />
      </View>
    </View>
  );
};

export default LogoutModal;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    logoutModal: {
      // backgroundColor: 'lightgray',
      gap: scale(40),
      paddingHorizontal: scale(26),
    },
    modalText: {
      ...textVar.baseBold,
      color: colors.text,
      textAlign: 'center',
    },
    buttonBox: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    noButton: {
      width: SCREEN.widthFixed * 85,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.second,
    },
    yesButton: {
      width: SCREEN.widthFixed * 85,
    },
    textButton: {
      ...textVar.base,
      color: colors.text,
    },
  });
