import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import React, { useEffect, useRef, useState } from 'react';
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
import { getLocales } from 'react-native-localize';

type LanguageInfo = {
  flag: string;
  nativeName: string;
};

type LanguagePickerProps = {
  toggleSheet: (prev: boolean) => void;
};

const LanguagePicker = ({ toggleSheet }: LanguagePickerProps) => {
  const flatListRef = useRef<any>(null);
  const { styles } = useStyles(createStyles);
  const [selectedIndex, setSelectedIndex] = useState<number | null>();

  useEffect(() => {
    const checkLanguage = async () => {
      let langName = '';
      const lngStored = await AsyncStorage.getItem('lng');
      if (lngStored) {
        langName = lngStored;
      } else {
        const locales = getLocales();
        langName = locales[0].languageCode;
      }
      const index = Object.keys(resources).indexOf(langName);
      setSelectedIndex(index);
    };

    checkLanguage();
  }, []);

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
        renderItem={({ index, item }) => (
          <Pressable
            style={[
              styles.countryCard,
              selectedIndex === index && styles.selectedItem,
              index === 0 && { marginTop: SCREEN.heightFixed * 35 * 2 },
              index === Object.keys(resources).length - 1 && {
                marginBottom: SCREEN.heightFixed * 35 * 2,
              },
            ]}
            onPress={() => handleSelectLanguage(item)}>
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
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 8,
    },
    commandsBox: {
      width: SCREEN.width100,
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
    textName: {
      ...textVar.large,
      // width: 'auto',
      paddingHorizontal: 8,
      color: colors.text,
      overflow: 'hidden',
    },
  });
