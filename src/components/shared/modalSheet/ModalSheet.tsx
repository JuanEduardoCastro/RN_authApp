import React, { ReactNode } from 'react';

import { Modal, StyleSheet, View } from 'react-native';

import useStyles from '@hooks/useStyles';

import { moderateScale, SCREEN } from '@constants/dimensions';
import { TColors } from '@constants/types';

type ModalSheetProps = {
  children: ReactNode;
  modalIsVisible: boolean;
  toggleSheet: (value: boolean) => void;
};

const ModalSheet = ({
  children,
  modalIsVisible,
  toggleSheet,
}: ModalSheetProps) => {
  const { styles } = useStyles(createStyles);

  const handleCloseModal = () => {
    toggleSheet(!modalIsVisible);
  };

  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={modalIsVisible}
      onRequestClose={handleCloseModal}>
      <View style={[styles.backdrop]}>
        <View style={[styles.sheet]}>{children}</View>
      </View>
    </Modal>
  );
};

export default ModalSheet;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      width: SCREEN.width100,
      height: SCREEN.height100,
      backgroundColor: colors.gray50,
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sheet: {
      backgroundColor: colors.background,
      padding: moderateScale(24),
      minHeight: SCREEN.heightFixed * 280,
      width: SCREEN.width90,
      borderRadius: 20,
      zIndex: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
