/* Core libs & third parties libs */
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
/* Custom components */
/* Custom hooks */
import useStyles from '@hooks/useStyles';
/* Types */
import { TColors } from '@constants/types';
/* Utilities & constants */
import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
/* Assets */
import {
  EditIcon,
  EyeCloseIcon,
  EyeOpenIcon,
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
      ...textVar.base,
      color: colors.text,
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
      ...textVar.base,
      height: SCREEN.heightFixed * 46,
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
      height: SCREEN.heightFixed * 19,
    },
    errorText: {
      ...textVar.mediumBold,
      color: colors.danger,
      marginTop: 2,
      letterSpacing: 0.6,
    },
  });
