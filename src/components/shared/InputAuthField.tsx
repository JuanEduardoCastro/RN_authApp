import React, { useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { Control, useController } from 'react-hook-form';

import useStyles from '@hooks/useStyles';

import { EyeCloseIcon, EyeOpenIcon } from '@assets/svg/icons';

import { SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import InfoPasswordModal from './modalSheet/InfoPasswordModal';
import ModalSheet from './modalSheet/ModalSheet';

type InputAuthFieldProps = {
  name: string;
  control: Control<any>;
  label?: string;
  rules?: any;
  labelStyles?: ViewStyle;
  inputStyles?: TextStyle;
} & TextInputProps;

const InputAuthField = ({
  name,
  control,
  label,
  rules,
  labelStyles,
  inputStyles,
  ...props
}: InputAuthFieldProps) => {
  const { field, fieldState } = useController({ name, control, rules });
  const { colors, styles } = useStyles(createStyles);
  const [toggleSecureEntry, setToggleSecureEntry] = useState(true);
  const [openInfo, setOpenInfo] = useState(false);

  const handleSecureEntry = () => {
    setToggleSecureEntry(!toggleSecureEntry);
  };

  const handleOpenInfo = () => {
    setOpenInfo(!openInfo);
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelBox}>
          <Text style={[styles.label, labelStyles]}>{label}</Text>
          {name.includes('password') && (
            <Pressable
              style={styles.buttonInfoIcon}
              onPress={() => handleOpenInfo()}>
              <Text style={[styles.text, labelStyles]}>ⓘ</Text>
            </Pressable>
          )}
        </View>
      )}
      <View
        style={[
          styles.inputBox,
          inputStyles,
          fieldState.error && styles.errorInput,
          !props.editable && styles.completeInput,
        ]}>
        <TextInput
          style={[
            styles.input,
            props.editable === false && {
              color: colors.gray,
            },
          ]}
          value={field.value}
          onChangeText={
            name === 'email'
              ? text => field.onChange(text.toLowerCase())
              : field.onChange
          }
          onBlur={field.onBlur}
          placeholderTextColor="gray"
          secureTextEntry={
            name.includes('password') ? toggleSecureEntry : false
          }
          keyboardType={name === 'phoneNumber' ? 'phone-pad' : 'default'}
          {...props}
        />
        {name.includes('password') && (
          <Pressable style={styles.iconArea} onPress={handleSecureEntry}>
            {toggleSecureEntry ? (
              <EyeCloseIcon width={20} height={20} color={colors.second} />
            ) : (
              <EyeOpenIcon width={20} height={20} color={colors.second} />
            )}
          </Pressable>
        )}
      </View>
      <View style={styles.errorBox}>
        {fieldState.error && (
          <Text style={styles.errorText}>{fieldState.error.message}</Text>
        )}
      </View>
      <ModalSheet modalIsVisible={openInfo} toggleSheet={handleOpenInfo}>
        <InfoPasswordModal toggleModalSheet={handleOpenInfo} />
      </ModalSheet>
    </View>
  );
};

export default InputAuthField;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    labelBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 4,
    },
    label: {
      ...textVar.base,
      color: colors.text,
      marginBottom: 5,
    },
    text: {
      ...textVar.smallBold,
      textAlign: 'center',
      color: colors.text,
      marginBottom: 5,
    },
    buttonInfoIcon: {
      paddingHorizontal: 4,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    input: {
      ...textVar.base,
      height: SCREEN.heightFixed * 48,
      flexGrow: 1,
      width: 'auto',
      paddingVertical: 10,
      paddingHorizontal: 8,
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
      height: SCREEN.heightFixed * 20,
    },
    errorText: {
      ...textVar.mediumBold,
      color: colors.danger,
      marginTop: 2,
      letterSpacing: 0.6,
    },
  });
