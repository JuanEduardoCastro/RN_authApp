import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';

type MailContactBoxProps = {
  title?: string;
};

const MailContactBox = ({ title }: MailContactBoxProps) => {
  const { colors, styles } = useStyles(createStyles);
  const subject = 'Contact from auth-app!';
  const body = `Today, ${new Date(Date.now()).toISOString()}`;

  const mailURL = `mailto:${title}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  const handleOpenMailApp = async () => {
    console.log('ABRIO LA APP DE MAIL ?');
    try {
      await Linking.openURL(mailURL);
    } catch (error) {
      console.log('XX -> MailContactBox.tsx:26 -> error :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Contact:</Text>
      <Pressable onPress={handleOpenMailApp} style={styles.mailBox}>
        <Text style={styles.mailText}>{title} </Text>
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
      color: colors.text,
      fontSize: 15,
    },
    mailBox: {},
    mailText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: 500,
      opacity: 0.7,
    },
  });
