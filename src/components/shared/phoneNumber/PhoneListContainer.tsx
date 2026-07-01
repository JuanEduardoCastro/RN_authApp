import React, { useRef, useState } from 'react';

import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';

import MaskedView from '@react-native-masked-view/masked-view';

import useStyles from '@hooks/useStyles';

import { countriesList } from '@constants/countriesList';
import { moderateScale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import AppText from '../appsComps/AppText';
import BorderMaskGradient from '../borderMaskGradient/BorderMaskGradient';

type PhoneListContainerProps = {
  toggleSheet: () => void;
  selectedValue: {
    code: string | null;
    dialCode: string | null;
    number: string | null;
  } | null;
  indexToScroll: number | null;
  onSelectCountry: (index: number) => void;
} & ViewProps;

const PhoneListContainer = ({
  toggleSheet,
  indexToScroll,
  onSelectCountry,
}: PhoneListContainerProps) => {
  const flatListRef = useRef<any>(null);
  const { styles } = useStyles(createStyles);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    indexToScroll,
  );

  // A robust way to scroll to the initial index once the layout is ready.
  const handleOnLayout = () => {
    if (indexToScroll !== null && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: indexToScroll,
        animated: false, // No animation on initial load
        viewPosition: 0.5,
      });
    }
  };

  const handleSelectCode = (index: number) => {
    setSelectedIndex(index);
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const handleCancelButton = () => {
    toggleSheet();
  };

  const handleDoneButton = () => {
    toggleSheet();
    if (selectedIndex !== null) {
      onSelectCountry(selectedIndex);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.commandsBox}>
        <Pressable onPress={handleCancelButton}>
          <AppText style={styles.commandsText}>Cancel</AppText>
        </Pressable>
        <Pressable onPress={handleDoneButton}>
          <AppText style={styles.commandsText}>Done</AppText>
        </Pressable>
      </View>
      <MaskedView
        maskElement={<BorderMaskGradient />}
        style={styles.countriesList}>
        <FlatList
          ref={flatListRef}
          data={countriesList}
          onLayout={handleOnLayout}
          showsVerticalScrollIndicator={false}
          extraData={selectedIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN.heightFixed * 35,
            offset: SCREEN.heightFixed * 35 * index + 70,
            index: index,
          })}
          renderItem={({ item, index }) => (
            <Pressable key={index + 1} onPress={() => handleSelectCode(index)}>
              <View
                style={[
                  styles.countryCard,
                  selectedIndex === index && styles.selectedItem,
                  index === 0 && { marginTop: SCREEN.heightFixed * 35 * 2 },
                  index === countriesList.length - 1 && {
                    marginBottom: SCREEN.heightFixed * 35 * 2,
                  },
                ]}>
                <AppText style={styles.textFlag}>{item.flag}</AppText>
                <AppText style={styles.textCode}>{item.dialCode}</AppText>
                <AppText
                  style={styles.textName}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.name}
                </AppText>
              </View>
            </Pressable>
          )}
        />
      </MaskedView>
    </View>
  );
};

export default PhoneListContainer;

const createStyles = (colors: TColors) =>
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
      paddingHorizontal: moderateScale(18),
      paddingVertical: 8,
    },
    commandsText: {
      ...textVar.baseBold,
      color: colors.text,
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
  });
