import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode, use } from 'react';
import Separator from '../Separator';
import useStyles from '@hooks/useStyles';
import { SCREEN } from '@constants/sizes';
import { TColors } from '@constants/types';
import { textVar } from '@constants/textVar';

type ModalSheetButtonProps = {
  children: ReactNode;
  modalIsVisible: boolean;
  toggleSheet: (prev: boolean) => void;
};

const ModalSheetButton = ({
  children,
  modalIsVisible,
  toggleSheet,
}: ModalSheetButtonProps) => {
  const { colors, styles } = useStyles(createStlyes);

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
        <Pressable
          style={styles.closeButton}
          onPress={prev => toggleSheet(!prev)}
        />
      </View>
      <View style={[styles.sheet]}>
        <View style={styles.cropLine}>
          <Separator borderWidth={3} height={12} />
        </View>

        {children}
      </View>
    </Modal>
  );
};

export default ModalSheetButton;

const createStlyes = (colors: TColors) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      width: SCREEN.width100,
      height: SCREEN.height100,
      backgroundColor: colors.gray,
      opacity: 0.5,
      zIndex: 1,
    },
    closeButton: {
      flex: 1,
    },
    sheet: {
      backgroundColor: colors.background,
      padding: 8,
      height: SCREEN.heightFixed * 300,
      width: '100%',
      position: 'absolute',
      bottom: 0,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
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
    cropLine: {
      width: 60,
      overflow: 'hidden',
      borderRadius: 50,
    },
  });
