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
import React, { useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import { SCREEN } from '@constants/sizes';
import {
  ClosedLockIcon,
  EyeCloseIcon,
  EyeOpenIcon,
  OpenLockIcon,
  PencilIcon,
} from '@assets/svg/icons';

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
  const { colors, styles } = useStyles(createStlyes);
  const [toggleSecureEntry, setToggleSecureEntry] = useState(true);

  const handleSecureEntry = () => {
    setToggleSecureEntry(!toggleSecureEntry);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, labelStyles]}>{label}</Text>}
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
        {name !== 'email' && props.editable && (
          <Pressable style={styles.iconArea}>
            <PencilIcon width={18} height={18} color={colors.second} />
          </Pressable>
        )}
        {name.includes('password') &&
          (toggleSecureEntry ? (
            <Pressable style={styles.iconArea} onPress={handleSecureEntry}>
              <EyeCloseIcon width={20} height={20} color={colors.second} />
            </Pressable>
          ) : (
            <Pressable style={styles.iconArea} onPress={handleSecureEntry}>
              <EyeOpenIcon width={20} height={20} color={colors.second} />
            </Pressable>
          ))}
      </View>
      <View style={styles.errorBox}>
        {fieldState.error && (
          <Text style={styles.errorText}>{fieldState.error.message}</Text>
        )}
        {/* {error !== null && (
          <Text style={styles.errorText}>{error as string}</Text>
        )} */}
      </View>
    </View>
  );
};

export default InputAuthField;

const createStlyes = (colors: TColors) =>
  StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    label: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 5,
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
      height: SCREEN.heightFixed * 46,
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
      borderColor: 'red',
    },
    completeInput: {
      borderColor: colors.gray,
    },
    errorBox: {
      height: SCREEN.heightFixed * 16,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginTop: 2,
    },
  });
