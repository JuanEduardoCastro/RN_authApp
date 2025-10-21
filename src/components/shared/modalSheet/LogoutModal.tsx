import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../Button';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { textVar } from '@constants/textVar';
import { useTranslation } from 'react-i18next';

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
          title="No"
          onPress={toggleModalSheet}
          buttonStyles={styles.noButton}
          textStyles={styles.textButton}
        />
        <Button title="Yes" onPress={handleLogut} />
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
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.second,
    },
    textButton: {
      ...textVar.base,
      color: colors.text,
    },
  });
