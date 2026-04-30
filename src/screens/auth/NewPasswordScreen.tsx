import React, { useEffect, useState } from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { jwtDecode } from 'jwt-decode';

import { useAppDispatch } from '@store/hooks';
import { createUser, updatePassword } from '@store/thunks';
import { CreateUserPayload, UpdatePasswordPayload } from '@store/types';

import { AuthStackScreenProps } from '@navigation/types';

import Button from '@components/shared/Button';
import ButtonNoBorder from '@components/shared/ButtonNoBorder';
import InputAuthField from '@components/shared/InputAuthField';
import DismissKeyboardOnClick from '@components/shared/keyboard/DismissKeyboardOnClick';
import Separator from '@components/shared/Separator';

import { CustomJwtPayload } from '@hooks/types';
import useStyles from '@hooks/useStyles';

import { SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';
import {
  validateEmailToken,
  validatePasswordInput,
} from '@utils/validationHelper';

import { setNotificationMessage } from 'src/store/authSlice';

interface FormNewDataProps {
  email: string;
  new_password: string;
  confirm_password: string;
}

const NewPasswordScreen = ({
  navigation,
  route,
}: AuthStackScreenProps<'NewPasswordScreen'>) => {
  const { emailToken } = route.params;
  const dispatch = useAppDispatch();
  const method = useForm<FormNewDataProps>();
  const { handleSubmit, control, watch } = method;
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const [email, setEmail] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(true);

  useEffect(() => {
    if (!emailToken) {
      navigation.popToTop();
      dispatch(
        setNotificationMessage({
          messageType: 'warning',
          notificationMessage: t('warning-email-checked'),
        }),
      );
      return;
    }

    try {
      const validationToken = validateEmailToken(emailToken);

      if (validationToken) {
        __DEV__ &&
          console.log(
            'XX -> NewPasswordScreen.tsx:67 -> NewPasswordScreen -> Invalid token for new user/ppassword',
          );
        navigation.popToTop();
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: t('error-invalid-token'),
          }),
        );
        return;
      }
      const decode = jwtDecode<CustomJwtPayload>(emailToken);
      const userEmail = decode.email;
      const newUser = decode.isNew !== undefined ? decode.isNew : true;
      setIsNewUser(newUser);
      setEmail(userEmail);
      if (decode.exp) {
        const isExpired = Date.now() / 1000 > decode.exp;
        if (isExpired) {
          dispatch(
            setNotificationMessage({
              messageType: 'warning',
              notificationMessage: t('warning-code-expired'),
            }),
          );
          navigation.replace('CheckEmailScreen', {
            checkMode: newUser ? 'new_password' : 'reset_password',
          });
        }
      }
    } catch (error) {
      __DEV__ &&
        console.log(
          'XX -> NewPasswordScreen.tsx:83 -> NewPasswordScreen -> error :',
          error,
        );
      navigation.popToTop();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailToken, navigation, dispatch]);

  const onSubmit = async (data: FormNewDataProps) => {
    Keyboard.dismiss();
    if (data.new_password !== data.confirm_password) {
      dispatch(
        setNotificationMessage({
          messageType: 'warning',
          notificationMessage: t('warning-two-passwords'),
        }),
      );
    } else {
      const dataAPI = {
        email: email,
        password: data.new_password,
        token: emailToken,
        t,
      };

      if (!emailToken) return;
      const decode = jwtDecode<CustomJwtPayload>(emailToken);
      const newUser = decode.isNew !== undefined ? decode.isNew : true;
      const actionToDispatch = newUser
        ? createUser(dataAPI as CreateUserPayload)
        : updatePassword(dataAPI as UpdatePasswordPayload);

      try {
        const res = await dispatch(actionToDispatch).unwrap();
        if (res?.success) {
          navigation.navigate('LoginScreen');
        }
      } catch (error) {
        __DEV__ &&
          console.log(
            'XX -> NewPasswordScreen.tsx:118 -> onSubmit -> error :',
            error,
          );
      }
    }
  };

  return (
    <FormProvider {...method}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
        <DismissKeyboardOnClick>
          <View>
            <View style={styles.titleBox}>
              <Text style={styles.subTitle}>
                {t('new-password-label-placeholder')}
              </Text>
            </View>
            <View style={styles.inputBox}>
              <Separator borderWidth={0} />
              <InputAuthField
                inputStyles={styles.textinput}
                name="new_password"
                label={t('new-password-label')}
                control={control}
                rules={{
                  required: t('password-required'),
                  minLength: {
                    value: 8,
                    message: t('password-invalid'),
                  },
                  maxLength: {
                    value: 128,
                    message: t('info-password-max'),
                  },
                  validate: (value: string) => {
                    return validatePasswordInput(value, t);
                  },
                }}
                placeholder={t('new-password-label-placeholder')}
              />
              <InputAuthField
                inputStyles={styles.textinput}
                name="confirm_password"
                label={t('confirm-password-label')}
                control={control}
                rules={{
                  required: t('password-required'),
                  minLength: {
                    value: 8,
                    message: t('password-invalid'),
                  },
                  maxLength: {
                    value: 128,
                    message: t('info-password-max'),
                  },
                  validate: (value: string) => {
                    if (value !== watch('new_password')) {
                      return t('warning-two-passwords');
                    }
                    return validatePasswordInput(value, t);
                  },
                }}
                placeholder={t('confirm-password-label-placeholder')}
              />
            </View>
            <View style={styles.buttonBox}>
              <Button
                title={
                  isNewUser
                    ? t('register-user-button')
                    : t('new-password-button')
                }
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
            </View>
          </View>
        </DismissKeyboardOnClick>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};

export default NewPasswordScreen;

const createStyles = (colors: TColors) =>
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
