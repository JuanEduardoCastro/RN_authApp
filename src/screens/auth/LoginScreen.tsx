import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AuthStackScreenProps } from 'src/navigators/types';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import useStyles from '@hooks/useStyles';
import InputAuthField from '@components/shared/InputAuthField';
import CheckBoxCustom from '@components/shared/CheckBoxCustom';
import Button from '@components/shared/Button';
import { loginUser, useAppDispatch } from 'src/store/authHook';
import Separator from '@components/shared/Separator';

interface FormDataProps {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginScreen = ({
  navigation,
  route,
}: AuthStackScreenProps<'LoginScreen'>) => {
  const methods = useForm<FormDataProps>();
  const { handleSubmit, control } = methods;
  const { colors, styles } = useStyles(createStlyes);
  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormDataProps) => {
    try {
      const res = await dispatch(loginUser(data));
      if (res?.success) {
        navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> LoginScreen.tsx:42 -> onSubmit -> error :', error);
      navigation.popToTop();
    }
  };
  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.subTitle}>
            {'Enter your account with your email'}
          </Text>
        </View>
        <View style={styles.inputBox}>
          <Separator borderWidth={0} />
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
          />
          <CheckBoxCustom
            name="rememberMe"
            label="Remember me"
            control={control}
          />
        </View>
        <Separator borderWidth={0} height={16} />
        <View style={styles.buttonBox}>
          <Button
            onPress={handleSubmit(onSubmit)}
            buttonStyles={{ backgroundColor: colors.second }}
            textStyles={{ color: colors.textNgt, fontWeight: 600 }}
          />
        </View>
        <View style={styles.gobackBox}>
          <Pressable
            style={{ padding: 8 }}
            onPress={() => navigation.popToTop()}>
            <Text style={styles.gobackText}>
              Go back to select other option!
            </Text>
          </Pressable>
          <Pressable
            style={{ padding: 8 }}
            onPress={() =>
              navigation.navigate('CheckEmailScreen', {
                checkMode: 'reset_password',
              })
            }>
            <Text style={styles.gobackText}>Reset your password</Text>
          </Pressable>
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
    titleBox: {
      // backgroundColor: "pink",
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    subTitle: {
      textAlign: 'center',
      color: colors.text,
      fontWeight: 500,
      fontSize: 18,
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
    gobackBox: {
      alignItems: 'center',
    },
    gobackText: {
      color: colors.second,
    },
  });
