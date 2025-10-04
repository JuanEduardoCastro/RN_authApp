import { Modal, StyleSheet } from 'react-native';
import React, { ReactNode } from 'react';

type ModalSheetButtonProps = {
  children: ReactNode;
  modalIsVisible: boolean;
};

const ModalSheetButton = ({
  children,
  modalIsVisible,
}: ModalSheetButtonProps) => {
  return (
    <Modal animationType={'none'} transparent={true} visible={modalIsVisible}>
      {children}
    </Modal>
  );
};

export default ModalSheetButton;

const styles = StyleSheet.create({});
