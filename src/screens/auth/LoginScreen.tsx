import { Alert, StyleSheet, View } from 'react-native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LoginScreenNavigationProp } from 'src/navigators/types';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import useStyles from '@hooks/useStyles';
import InputAuthField from '@components/shared/InputAuthField';
import CheckBoxCustom from '@components/shared/CheckBoxCustom';
import Button from '@components/shared/Button';
import { loginUser, useAppDispatch } from 'src/store/authHook';
import { setError } from 'src/store/authSlice';

interface FormDataProps {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginScreen = ({ navigation, route }: LoginScreenNavigationProp) => {
  const methods = useForm<FormDataProps>();
  const { handleSubmit, control } = methods;
  const { colors, styles } = useStyles(createStlyes);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormDataProps) => {
    try {
      const res = await dispatch(loginUser(data));
      if (res?.success) {
        navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
      } else {
        dispatch(setError(res?.message));
      }
    } catch (error) {
      console.log('XX -> LoginScreen.tsx:36 -> onSubmit -> error :', error);
    }
  };
  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <InputAuthField
            inputStyles={styles.textinput}
            name="email"
            label="Email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Invalid email address',
              },
            }}
            placeholder="Enter your email"
          />
          <InputAuthField
            inputStyles={styles.textinput}
            name="password"
            label="Password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            placeholder="Enter your password"
            secureTextEntry
          />
          <CheckBoxCustom
            name="rememberMe"
            label="Remember me"
            control={control}
          />
        </View>
        <View style={styles.buttonBox}>
          <Button
            onPress={handleSubmit(onSubmit)}
            buttonStyles={{ backgroundColor: colors.second }}
            textStyles={{ color: colors.textNgt, fontWeight: 600 }}
          />
        </View>
      </View>
    </FormProvider>
  );
};

export default LoginScreen;

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
