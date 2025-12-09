/* Core libs & third parties libs */
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
/* Custom components */
import InputAuthField from '@components/shared/InputAuthField';
import CheckBoxCustom from '@components/shared/CheckBoxCustom';
import Button from '@components/shared/Button';
import Separator from '@components/shared/Separator';
import ButtonNoBorder from '@components/shared/ButtonNoBorder';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
/* Types */
import { AuthStackScreenProps } from '@navigation/types';
/* Utilities & constants */
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
import { useTranslation } from 'react-i18next';
import DismissKeyboardOnClick from '@components/shared/keyboard/DismissKeyboardOnClick';
import { useAppDispatch } from '@store/hooks';
import { loginUser } from '@store/thunks';
/* Assets */

interface FormDataProps {
  email: string;
  password: string;
  rememberMe: boolean;
  token: string | null;
  userData: Record<string, string>;
}

const LoginScreen = ({ navigation }: AuthStackScreenProps<'LoginScreen'>) => {
  const methods = useForm<FormDataProps>();
  const { handleSubmit, control } = methods;
  const { styles } = useStyles(createStlyes);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: FormDataProps) => {
    Keyboard.dismiss();
    try {
      const res = await dispatch(loginUser({ ...data, t })).unwrap();
      if (res?.success) {
        navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> LoginScreen.tsx:48 -> onSubmit -> error :', error);
      navigation.popToTop();
    }
  };
  return (
    <FormProvider {...methods}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}>
        <DismissKeyboardOnClick>
          <View>
            <View style={styles.titleBox}>
              <Text style={styles.subTitle}>{t('enter-email-title')}</Text>
            </View>
            <View style={styles.inputBox}>
              <Separator borderWidth={0} />
              <InputAuthField
                inputStyles={styles.textinput}
                name="email"
                label={t('email-label')}
                control={control}
                rules={{
                  required: t('email-required'),
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: t('email-invalid'),
                  },
                }}
                placeholder={t('enter-email-placeholder')}
              />
              <InputAuthField
                inputStyles={styles.textinput}
                name="password"
                label={t('password-label')}
                control={control}
                rules={{
                  required: t('password-required'),
                  minLength: {
                    value: 8,
                    message: t('password-invalid'),
                  },
                }}
                placeholder={t('enter-password-placeholder')}
              />
              <CheckBoxCustom
                name="rememberMe"
                label={t('remember-me-label')}
                control={control}
              />
            </View>
            <Separator borderWidth={0} height={16} />
            <View style={styles.buttonBox}>
              <Button
                title={t('login-button')}
                onPress={handleSubmit(onSubmit)}
                buttonStyles={styles.button}
                textStyles={styles.buttonText}
              />
            </View>
            <View style={styles.gobackBox}>
              <ButtonNoBorder
                title={t('go-back-button')}
                onPress={() => navigation.popToTop()}
              />
              <ButtonNoBorder
                title={t('reset-password-go-to')}
                onPress={() =>
                  navigation.navigate('CheckEmailScreen', {
                    checkMode: 'reset_password',
                  })
                }
              />
            </View>
          </View>
        </DismissKeyboardOnClick>
      </KeyboardAvoidingView>
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
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    subTitle: {
      ...textVar.largeBold,
      textAlign: 'center',
      color: colors.text,
    },
    inputBox: {
      width: SCREEN.width100,
      paddingHorizontal: 16,
    },
    textinput: {
      borderColor: colors.second,
    },
    buttonBox: {
      width: SCREEN.width100,
      alignItems: 'center',
      paddingVertical: 12,
    },
    button: {
      backgroundColor: colors.second,
      width: SCREEN.width50,
    },
    buttonText: {
      ...textVar.baseBold,
      color: colors.textNgt,
    },
    gobackBox: {
      alignItems: 'center',
    },
    gobackText: {
      ...textVar.medium,
      color: colors.second,
    },
  });
