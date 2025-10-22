import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../Button';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { textVar } from '@constants/textVar';
import { useTranslation } from 'react-i18next';
import { SCREEN } from '@constants/sizes';

type LogoutModalProps = {
  toggleModalSheet: () => void;
  handleLogut: () => void;
};

const LogoutModal = ({ toggleModalSheet, handleLogut }: LogoutModalProps) => {
  const { colors, styles } = useStyles(createStyles);
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
      gap: 40,
      paddingHorizontal: 26,
    },
    modalText: {
      ...textVar.mediumBold,
      color: colors.text,
      textAlign: 'center',
    },
    buttonBox: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    noButton: {
      width: SCREEN.widthFixed * 75,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.second,
    },
    yesButton: {
      width: SCREEN.widthFixed * 75,
    },
    textButton: {
      ...textVar.base,
      color: colors.text,
    },
  });
