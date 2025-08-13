/* Core libs & third parties libs */
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, { useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { useSharedValue } from 'react-native-reanimated';
/* Custom components */
import BottomSheet from '../bottomSheet/BottomSheet';
import PhoneListContainer from './PhoneListContainer';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import useUserData from '@hooks/useUserData';
/* Types */
import { TColors } from '@constants/types';
/* Utilities & constants */
import { SCREEN } from '@constants/sizes';
import { countriesList } from '@constants/countriesList';
import { textVar } from '@constants/textVar';
/* Assets */
import { ChevronIcon, EditIcon } from '@assets/svg/icons';

type PhoneNumberPickerProps = {
  name: string;
  control: Control<any>;
  rules?: any;
  setValue?: any;
  label?: string;
  labelStyles?: ViewStyle;
  inputStyles?: TextStyle;
} & TextInputProps;

const PhoneNumberPicker = ({
  name,
  control,
  rules,
  setValue,
  label,
  labelStyles,
  inputStyles,
  ...props
}: PhoneNumberPickerProps) => {
  const {
    phoneData,
    setPhoneData,
    codeIndex,
    setCodeIndex,
    indexToScroll,
    defaultCountryCode,
    defaultDialCode,
  } = useUserData();
  const { field, fieldState } = useController({ name, control, rules });
  const { colors, styles } = useStyles(createStlyes);
  const isOpen = useSharedValue(false);
  const [isVisible, setIsVisible] = useState(false);

  const handlePhoneNumberToSubmit = () => {
    field.onChange({
      code: phoneData?.code,
      dialCode: phoneData?.dialCode,
      number: phoneData?.number,
    });
    setCodeIndex(indexToScroll);
  };

  const handleUpdateNumber = (text: string) => {
    setPhoneData({
      code: phoneData?.code ?? '',
      dialCode: phoneData?.dialCode ?? '',
      number: text,
    });
    handlePhoneNumberToSubmit();
  };

  const toggleSheet = () => {
    isOpen.value = !isOpen.value;
    setIsVisible(!isVisible);
  };

  return (
    <>
      <View style={styles.container}>
        {label && <Text style={[styles.label, labelStyles]}>{label}</Text>}
        <View
          style={[
            styles.inputBox,
            inputStyles,
            fieldState.error && styles.errorInput,
            !props.editable && styles.completeInput,
          ]}>
          <View style={styles.pickerCodeBox}>
            <Pressable
              disabled={!props.editable}
              style={styles.pickerCodeFlag}
              onPress={toggleSheet}>
              {!phoneData
                ? countriesList.map(
                    (item, index) =>
                      defaultCountryCode === item.code && (
                        <Text key={index + 1} style={styles.pickerFlag}>
                          {item.flag}
                        </Text>
                      ),
                  )
                : countriesList.map(
                    (item, index) =>
                      item.code === phoneData.code &&
                      item.dialCode === phoneData.dialCode && (
                        <Text key={index + 1} style={styles.pickerFlag}>
                          {item.flag}
                        </Text>
                      ),
                  )}
              <ChevronIcon width={14} height={14} color={colors.text} />
            </Pressable>
            <View style={styles.pickerCodeView}>
              <View style={styles.vertSeparator} />
              <TextInput
                style={styles.pickerCode}
                editable={false}
                value={phoneData?.dialCode! ?? defaultDialCode}
              />
              <View style={styles.vertSeparator} />
            </View>
          </View>
          <TextInput
            style={[
              styles.input,
              props.editable === false && {
                color: colors.gray,
              },
            ]}
            maxLength={12}
            value={phoneData?.number ?? ''}
            onChangeText={text => handleUpdateNumber(text)}
            // onChangeText={text => setNewPhoneNumber(text)}
            // onBlur={field.onBlur}
            placeholderTextColor="gray"
            textContentType={
              name === 'phoneNumber' ? 'telephoneNumber' : 'none'
            }
            keyboardType={name === 'phoneNumber' ? 'phone-pad' : 'default'}
            {...props}
          />
          {name !== 'email' && props.editable && (
            <Pressable style={styles.iconArea}>
              <EditIcon width={18} height={18} color={colors.second} />
            </Pressable>
          )}
        </View>
        <View style={styles.errorBox}>
          {fieldState.error && (
            <Text style={styles.errorText}>{fieldState.error.message}</Text>
          )}
        </View>
      </View>
      <BottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
        {isVisible && (
          <PhoneListContainer
            toggleSheet={toggleSheet}
            phoneData={phoneData}
            codeIndex={codeIndex}
            indexToScroll={indexToScroll}
            setCodeIndex={setCodeIndex}
            handlePhoneNumberToSubmit={handlePhoneNumberToSubmit}
          />
        )}
      </BottomSheet>
    </>
  );
};

export default PhoneNumberPicker;

const createStlyes = (colors: TColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    label: {
      ...textVar.base,
      color: colors.text,
      marginBottom: 5,
    },
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 8,
      borderRadius: 12,
    },
    pickerCodeBox: {
      width: 'auto',
      height: SCREEN.heightFixed * 46,
      flexDirection: 'row',
    },
    pickerCodeFlag: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 6,
      paddingRight: 12,
      gap: 6,
    },
    pickerFlag: {
      fontSize: Platform.OS === 'ios' ? 24 : 18,
    },
    pickerCodeView: {
      width: 62,
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    pickerCode: {
      ...textVar.medium,
      color: colors.gray,
    },
    input: {
      height: SCREEN.heightFixed * 40,
      flexGrow: 1,
      width: 'auto',
      paddingVertical: 10,
      paddingHorizontal: 8,
      fontSize: 16,
      color: colors.text,
    },
    iconArea: {
      padding: 8,
    },
    errorInput: {
      borderColor: colors.danger,
    },
    completeInput: {
      borderColor: colors.gray,
    },
    errorBox: {
      height: SCREEN.heightFixed * 16,
    },
    errorText: {
      ...textVar.mediumBold,
      color: colors.danger,
      marginTop: 2,
      letterSpacing: 0.6,
    },
    vertSeparator: {
      height: '60%',
      borderLeftWidth: 1,
      borderColor: colors.gray,
    },
  });
