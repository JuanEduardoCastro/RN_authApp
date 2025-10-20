import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { resources } from 'src/locale/i18next';
import languagesList from '@constants/languagesList';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LanguageInfo = {
  flag: string;
  nativeName: string;
};

type LanguagePickerProps = {
  toggleSheet: (prev: boolean) => void;
  onSelectLanguage?: (index: number) => void;
  selectLanguage?: string;
};

const LanguagePicker = ({
  toggleSheet,
  onSelectLanguage,
  selectLanguage,
}: LanguagePickerProps) => {
  const flatListRef = useRef<any>(null);
  const { colors, styles } = useStyles(createStyles);

  const handleSelectLanguage = async (lng: any) => {
    i18next.changeLanguage(lng);
    await AsyncStorage.setItem('lng', lng);
    toggleSheet(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={Object.keys(resources)}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.countryCard}
            onPress={() => handleSelectLanguage(item)}
          >
            <Text style={styles.textFlag}>
              {
                (languagesList as unknown as Record<string, LanguageInfo>)[item]
                  .flag
              }
            </Text>
            <Text style={styles.textName}>
              {
                (languagesList as unknown as Record<string, LanguageInfo>)[item]
                  .nativeName
              }
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default LanguagePicker;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // width: SCREEN.widthFixed,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 8,
    },
    commandsBox: {
      width: SCREEN.width100,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingVertical: 8,
    },
    commandsText: {
      ...textVar.baseBold,
      color: colors.text,
    },
    languagesList: {
      width: SCREEN.width75,
      height: SCREEN.heightFixed * 35 * 5,
      overflow: 'hidden',
    },
    selectedItem: {
      borderWidth: 1,
      borderRadius: 12,
      borderColor: colors.second,
    },
    countryCard: {
      // width: SCREEN.widthFixed * 300,
      width: 'auto',
      height: SCREEN.heightFixed * 35,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    textFlag: {
      width: 50,
      fontSize: Platform.OS === 'ios' ? 24 : 20,
      color: colors.text,
      textAlign: 'center',
    },
    textCode: {
      ...textVar.base,
      width: 50,
      // fontSize: 16,
      color: colors.text,
      textAlign: 'right',
    },
    textName: {
      ...textVar.large,
      width: 'auto',
      // fontSize: 20,
      paddingLeft: 8,
      color: colors.text,
      overflow: 'hidden',
    },
    text: {
      color: colors.text,
    },
  });
