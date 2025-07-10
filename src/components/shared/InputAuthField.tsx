import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { Control, useController } from 'react-hook-form';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import { SCREEN } from '@constants/sizes';

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

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, labelStyles]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          inputStyles,
          fieldState.error && styles.errorInput,
        ]}
        value={field.value}
        onChangeText={
          name === 'email'
            ? text => field.onChange(text.toLowerCase())
            : field.onChange
        }
        onBlur={field.onBlur}
        placeholderTextColor="gray"
        {...props}
      />
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
      color: colors.text,
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      height: SCREEN.heightFixed * 40,
      width: 'auto',
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      fontSize: 16,
      color: colors.text,
    },
    errorInput: {
      borderColor: 'red',
    },
    errorBox: {
      height: SCREEN.heightFixed * 16,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 2,
    },
  });
