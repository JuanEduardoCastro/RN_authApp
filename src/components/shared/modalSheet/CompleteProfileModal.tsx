import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import useStyles from '@hooks/useStyles';

import { moderateScale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import Button from '../Button';

type CompleteProfileModalProps = {
  toggleModalSheet: () => void;
  handleGoToProfile: () => void;
};

const CompleteProfileModal = ({
  toggleModalSheet,
  handleGoToProfile,
}: CompleteProfileModalProps) => {
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.containerModal}>
      <Text style={styles.modalText}>{t('got-to-profile-message')}</Text>
      <View style={styles.buttonBox}>
        <Button
          title={t('go-later')}
          onPress={toggleModalSheet}
          buttonStyles={styles.noButton}
          textStyles={styles.textButton}
        />
        <Button
          title={t('go-to-profile')}
          onPress={handleGoToProfile}
          buttonStyles={styles.yesButton}
        />
      </View>
    </View>
  );
};

export default CompleteProfileModal;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    containerModal: {
      // backgroundColor: 'lightgray',
      gap: moderateScale(40),
      paddingHorizontal: moderateScale(26),
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
