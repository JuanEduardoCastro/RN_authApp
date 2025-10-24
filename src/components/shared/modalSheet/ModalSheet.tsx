import { Modal, StyleSheet, View } from 'react-native';
import React, { ReactNode } from 'react';
import useStyles from '@hooks/useStyles';
import { SCREEN } from '@constants/sizes';
import { TColors } from '@constants/types';

type ModalSheetProps = {
  children: ReactNode;
  modalIsVisible: boolean;
  toggleSheet: (prev: boolean) => void;
};

const ModalSheet = ({
  children,
  modalIsVisible,
  toggleSheet,
}: ModalSheetProps) => {
  const { styles } = useStyles(createStlyes);

  const handleCloseModal = () => {
    toggleSheet(false);
  };

  return (
    <Modal
      animationType={'none'}
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

const createStlyes = (colors: TColors) =>
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
      padding: 8,
      height: SCREEN.heightFixed * 240,
      width: '70%',
      borderRadius: 20,
      zIndex: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalHeader: {
      flex: 1,
      width: SCREEN.widthFixed,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 8,
    },
  });
