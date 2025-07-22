import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import { countriesList } from '@constants/countriesList';
import { SCREEN } from '@constants/sizes';
import MaskedView from '@react-native-masked-view/masked-view';
import BorderMaskGradient from '../borderMaskGradient/BorderMaskGradient';

type PhoneListContainerProps = {
  toggleSheet: () => void;
  phoneData: {
    code: string | null;
    dialCode: string | null;
    number: string | null;
  } | null;
  codeIndex: number | null;
  setCodeIndex: (val: number | null) => void;
  handlePhoneNumberToSubmit: () => void;
} & ViewProps;

const PhoneListContainer = ({
  toggleSheet,
  phoneData,
  codeIndex,
  setCodeIndex,
  handlePhoneNumberToSubmit,
}: PhoneListContainerProps) => {
  const flatListRef = useRef<any>(null);
  const { colors, styles } = useStyles(createStlyes);

  useEffect(() => {
    const waitForScrollToIndex = new Promise(resolve =>
      setTimeout(resolve, 300),
    );
    waitForScrollToIndex.then(() => {
      if (flatListRef.current && !codeIndex) {
        countriesList.map((item, index) => {
          if (item.dialCode === phoneData?.dialCode) {
            flatListRef.current.scrollToIndex({
              index: index,
              animated: true,
              viewPosition: 0.5,
            });
          }
        });
      }
    });
  }, []);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const handleSelectCode = (codeSelected: string, index: number) => {
    setCodeIndex(index);
    scrollToIndex(index);
  };

  const handleCancelButton = () => {
    console.log('CANCEL PICKER');
    setCodeIndex(null);
    toggleSheet();
  };

  const handleDoneButton = () => {
    console.log('SAVE PICKER');
    toggleSheet();
    codeIndex && handlePhoneNumberToSubmit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.commandsBox}>
        <Pressable onPress={handleCancelButton}>
          <Text style={styles.commandsText}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleDoneButton}>
          <Text style={styles.commandsText}>Done</Text>
        </Pressable>
      </View>
      <MaskedView
        maskElement={<BorderMaskGradient />}
        style={styles.countriesList}>
        <FlatList
          ref={flatListRef}
          data={countriesList}
          showsVerticalScrollIndicator={false}
          extraData={phoneData?.dialCode}
          renderItem={({ item, index }) => (
            <Pressable
              key={index + 1}
              onPress={() => handleSelectCode(item.dialCode, index)}>
              <View
                style={[
                  styles.countryCard,
                  phoneData?.dialCode === item.dialCode && styles.selectedItem,
                  index === 0 && { marginTop: SCREEN.heightFixed * 35 * 2 },
                  index === countriesList.length - 1 && {
                    marginBottom: SCREEN.heightFixed * 35 * 2,
                  },
                ]}>
                <Text style={styles.textFlag}>{item.flag}</Text>
                <Text style={styles.textCode}>{item.dialCode}</Text>
                <Text
                  style={styles.textName}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}>
                  {item.name.slice(0, 17)}
                  {item.name.length > 17 && '...'}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </MaskedView>
    </View>
  );
};

export default PhoneListContainer;

const createStlyes = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: SCREEN.widthFixed,
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
      fontSize: 16,
      color: colors.text,
      fontWeight: 600,
    },
    countriesList: {
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
      width: SCREEN.widthFixed * 300,
      height: SCREEN.heightFixed * 35,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      // gap: 12,
    },
    textFlag: {
      width: 50,
      fontSize: Platform.OS === 'ios' ? 24 : 20,
      color: colors.text,
      textAlign: 'center',
    },
    textCode: {
      width: 50,
      fontSize: 16,
      color: colors.text,
      textAlign: 'right',
    },
    textName: {
      width: 'auto',
      fontSize: 20,
      paddingLeft: 8,
      color: colors.text,
      overflow: 'hidden',
    },
  });
