import { Alert, StyleSheet, View } from 'react-native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SigninScreenNavigationProps } from 'src/navigators/types';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/screenSize';
import Button from '@components/shared/Button';
import InputAuthField from '@components/shared/InputAuthField';

interface FormNewDataProps {
  email: string;
  new_password: string;
  confirm_password: string;
}

const SigninScreen = ({ navigation, route }: SigninScreenNavigationProps) => {
  const method = useForm<FormNewDataProps>();
  const { handleSubmit, control } = method;
  const { colors, styles } = useStyles(createStlyes);

  const onSubmit = (data: FormNewDataProps) => {
    if (data.new_password !== data.confirm_password) {
      Alert.alert('The passwords must be the same');
    } else {
      const fullData = {
        email: route.params.email,
        password: data.new_password,
      };
      Alert.alert('User created succesfully');
      console.log('AGREGAR NUEVO USUARIO', fullData);
    }
  };

  return (
    <FormProvider {...method}>
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <InputAuthField
            inputStyles={styles.textinput}
            name="new_password"
            label="New password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            placeholder="Enter your new password"
            secureTextEntry
          />
          <InputAuthField
            inputStyles={styles.textinput}
            name="confirm_password"
            label="Confirm password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            placeholder="Confirm your new password"
            secureTextEntry
          />
        </View>
        <View style={styles.buttonBox}>
          <Button
            title={'Register user'}
            onPress={handleSubmit(onSubmit)}
            buttonStyles={{ backgroundColor: colors.second }}
            textStyles={{ color: colors.textNgt, fontWeight: 600 }}
          />
        </View>
      </View>
    </FormProvider>
  );
};

export default SigninScreen;

const createStlyes = (colors: TColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
    },
    inputBox: {
      width: SCREEN.width100,
      paddingHorizontal: 16,
    },
    textinput: {
      borderColor: colors.second,
    },
    buttonBox: {
      width: SCREEN.widthFixed * 240,
      paddingVertical: 12,
    },
  });
