import { Modal, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';

type ModalSheetButtonProps = {
  children: ReactNode;
  modalIsVisible: boolean;
};

const ModalSheetButton = ({
  children,
  modalIsVisible,
}: ModalSheetButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    modalIsVisible ? setIsVisible(true) : setIsVisible(false);
  }, []);

  return (
    <Modal animationType={'none'} transparent={true} visible={isVisible}>
      {children}
    </Modal>
  );
};

export default ModalSheetButton;

const styles = StyleSheet.create({});
