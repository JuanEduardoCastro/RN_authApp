import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import useStyles from '@hooks/useStyles';

import { moderateScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import Button from '../Button';
import Separator from '../Separator';

type DeleteMessageModalProps = {
  toggleModalSheet: () => void;
  handleDelete: () => void;
};

const DeleteMessageModal = ({
  toggleModalSheet,
  handleDelete,
}: DeleteMessageModalProps) => {
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.containerModal}>
      <Text style={styles.modalText}>{t('delete-message-confirm')}</Text>
      <Separator border={false} height={60} />
      <View style={styles.buttonBox}>
        <Button
          title={t('delete-message-cancel')}
          onPress={toggleModalSheet}
          style={styles.buttonSize}
          buttonStyles={styles.noButton}
          textStyles={styles.noTextButton}
        />
        <Button
          title={t('delete-message-button')}
          onPress={handleDelete}
          style={styles.buttonSize}
          buttonStyles={styles.yesButton}
          textStyles={styles.yesTextButton}
        />
      </View>
    </View>
  );
};

export default DeleteMessageModal;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    containerModal: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalText: {
      ...textVar.baseBold,
      color: colors.text,
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
    noTextButton: {
      ...textVar.base,
      color: colors.text,
    },
    yesButton: {
      width: '100%',
      borderWidth: 0,
      backgroundColor: colors.danger,
    },
    yesTextButton: {
      ...textVar.base,
      color: colors.textNgt,
    },
  });
