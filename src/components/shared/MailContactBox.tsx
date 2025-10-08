import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
import { useTranslation } from 'react-i18next';

/* Core libs & third parties libs */
/* Custom components */
/* Custom hooks */
/* Types */
/* Utilities & constants */
/* Assets */

type MailContactBoxProps = {
  title?: string;
};

const MailContactBox = ({ title }: MailContactBoxProps) => {
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();

  const subject = 'Contact from auth-app!';
  const body = `Today, ${new Date(Date.now()).toISOString()}`;

  const mailURL = `mailto:${title}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  const handleOpenMailApp = async () => {
    const canOpen = await Linking.canOpenURL(mailURL);
    if (canOpen) {
      try {
        await Linking.openURL(mailURL);
      } catch (error) {
        __DEV__ &&
          console.log(
            'XX -> MailContactBox.tsx:44 -> handleOpenMailApp -> error :',
            error,
          );
        Alert.alert('Error', 'Could not open mail app.');
      }
    } else {
      Alert.alert('No Mail App', 'Please configure a mail client to continue.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{t('contact-title')}...</Text>
      <Pressable
        onPress={handleOpenMailApp}
        style={({ pressed }) => [styles.mailBox, pressed && styles.pressed]}
        accessibilityLabel={`Contact by email: ${title}`}
        accessibilityRole="button">
        <Text style={styles.mailText}>{title}</Text>
      </Pressable>
    </View>
  );
};

export default MailContactBox;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      width: SCREEN.width90,
      padding: 6,
      alignItems: 'flex-end',
      gap: 4,
    },
    titleText: {
      ...textVar.mediumBold,
      color: colors.text,
    },
    mailBox: {},
    mailText: {
      ...textVar.smallBold,
      color: colors.text,
      opacity: 0.7,
      letterSpacing: 0.4,
    },
    pressed: {
      opacity: 0.7,
    },
  });
