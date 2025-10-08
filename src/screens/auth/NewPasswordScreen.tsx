/* Core libs & third parties libs */
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
/* Custom components */
import Button from '@components/shared/Button';
import InputAuthField from '@components/shared/InputAuthField';
import Separator from '@components/shared/Separator';
import ButtonNoBorder from '@components/shared/ButtonNoBorder';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import {
  createUser,
  updatePassword,
  useAppDispatch,
  useAppSelector,
} from 'src/store/authHook';
/* Types */
import { CustomJwtPayload } from '@hooks/types';
import { TColors } from '@constants/types';
import { AuthStackScreenProps } from '@navigation/types';
/* Utilities & constants */
import { SCREEN } from '@constants/sizes';
import { setNotificationMessage, userAuth } from 'src/store/authSlice';
import { textVar } from '@constants/textVar';
import { DataAPI } from '@store/types';
import { useTranslation } from 'react-i18next';
/* Assets */

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
  const { messageType } = useAppSelector(userAuth);
  const dispatch = useAppDispatch();
  const method = useForm<FormNewDataProps>();
  const { handleSubmit, control, setError } = method;
  const { colors, styles } = useStyles(createStlyes);
  const { t } = useTranslation();
  const [email, setEmail] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<boolean>(true);

  useEffect(() => {
    try {
      if (emailToken !== null) {
        const decode = jwtDecode<CustomJwtPayload>(emailToken);
        const userEmail = decode.email;
        decode.isNew !== undefined && setNewUser(decode.isNew);
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
            // Immediately replace the current screen to prevent further interaction.
            navigation.replace('CheckEmailScreen', {
              checkMode: newUser ? 'new_password' : 'reset_password',
            });
          }
        }
      } else {
        navigation.popToTop();
        dispatch(
          setNotificationMessage({
            messageType: 'warning',
            notificationMessage: t('warning-email-checked'),
          }),
        );
      }
    } catch (error) {
      __DEV__ &&
        console.log(
          'XX -> NewPasswordScreen.tsx:83 -> NewPasswordScreen -> error :',
          error,
        );
      navigation.popToTop();
    }
  }, []);

  const onSubmit = async (data: FormNewDataProps) => {
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

      const actionToDispatch = newUser
        ? createUser(dataAPI as DataAPI)
        : updatePassword(dataAPI as DataAPI);

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

        // Errors are now handled by the rejected case in the extraReducers.
        // We no longer navigate away on failure.
      }
    }
  };

  return (
    <FormProvider {...method}>
      <View style={styles.container}>
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
                value: 6,
                message: t('password-invalid'),
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
                value: 6,
                message: t('password-invalid'),
              },
            }}
            placeholder={t('confirm-password-label-placeholder')}
          />
        </View>
        <View style={styles.buttonBox}>
          <Button
            title={
              newUser ? t('register-user-button') : t('new-password-button')
            }
            onPress={handleSubmit(onSubmit)}
            buttonStyles={{ backgroundColor: colors.second }}
            textStyles={{ color: colors.textNgt, fontWeight: 600 }}
          />
        </View>
        <View style={styles.gobackBox}>
          <ButtonNoBorder
            title={t('go-back-button')}
            onPress={() => navigation.popToTop()}
          />
        </View>
      </View>
    </FormProvider>
  );
};

export default NewPasswordScreen;

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
      width: SCREEN.widthFixed * 240,
      paddingVertical: 12,
    },
    gobackBox: {},
    gobackText: {
      ...textVar.medium,
      color: colors.second,
    },
  });
