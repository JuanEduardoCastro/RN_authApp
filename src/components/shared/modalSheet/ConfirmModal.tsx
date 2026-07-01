import React from 'react';

import { StyleSheet, View } from 'react-native';

import useStyles from '@hooks/useStyles';

import { moderateScale } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import Button from '../appsComps/AppButton';
import AppText from '../appsComps/AppText';
import Separator from '../Separator';

type ConfirmModalProps = {
  title?: string;
  message: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmDanger?: boolean;
};

const ConfirmModal = ({
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  confirmDanger,
}: ConfirmModalProps) => {
  const { styles } = useStyles(createStyles);

  return (
    <View style={styles.containerModal}>
      {title && <AppText style={styles.title}>{title}</AppText>}
      <Separator border={false} height={12} />
      <AppText style={styles.message}>{message}</AppText>
      <Separator border={false} height={60} />
      <View style={styles.buttonBox}>
        <Button
          title={cancelLabel}
          onPress={onCancel}
          style={styles.buttonSize}
          buttonStyles={styles.noButton}
          textStyles={styles.noTextButton}
        />
        <Button
          title={confirmLabel}
          onPress={onConfirm}
          style={styles.buttonSize}
          buttonStyles={
            confirmDanger ? styles.yesDangerButton : styles.yesButton
          }
          textStyles={styles.yesTextButton}
        />
      </View>
    </View>
  );
};

export default ConfirmModal;

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
      backgroundColor: colors.second,
    },
    yesTextButton: {
      ...textVar.base,
      color: colors.textNgt,
    },
    yesDangerButton: {
      width: '100%',
      borderWidth: 0,
      backgroundColor: colors.danger,
    },
  });
