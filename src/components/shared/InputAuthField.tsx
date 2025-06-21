import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { Control, useController } from 'react-hook-form';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';

type InputAuthFieldProps = {
  name: string;
  control: Control<any>;
  label?: string;
  rules?: any;
  placeholder?: string;
  secureTextEntry?: boolean;
};

const InputAuthField = ({
  name,
  control,
  label,
  rules,
  placeholder,
  secureTextEntry,
}: InputAuthFieldProps) => {
  const { field, fieldState } = useController({ name, control, rules });
  const { colors, styles } = useStyles(createStlyes);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, fieldState.error && styles.errorInput]}
        value={field.value}
        onChangeText={
          name === 'email'
            ? text => field.onChange(text.toLowerCase())
            : field.onChange
        }
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onBlur={field.onBlur}
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
      fontSize: 16,
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
    },
    errorInput: {
      borderColor: 'red',
    },
    errorBox: {
      height: 16,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 2,
    },
  });
