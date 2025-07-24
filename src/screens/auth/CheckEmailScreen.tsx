import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CheckEmailScreenNavigationProps } from 'src/navigators/types';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import InputAuthField from '@components/shared/InputAuthField';
import Button from '@components/shared/Button';
import { checkEmail, resetPassword, useAppDispatch } from 'src/store/authHook';
import Separator from '@components/shared/Separator';
import { sharedColors } from '@constants/colors';
import { newNotificationMessage } from '@utils/newNotificationMessage';

interface CheckEmailProps {
  email: string;
}

const CheckEmailScreen = ({
  navigation,
  route,
}: CheckEmailScreenNavigationProps) => {
  const { checkMode } = route.params;
  const method = useForm<CheckEmailProps>();
  const { handleSubmit, control } = method;
  const { colors, styles } = useStyles(createStlyes);
  const dispatch = useAppDispatch();
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const onSubmit = async (data: CheckEmailProps) => {
    try {
      if (checkMode) {
        const res = await dispatch(resetPassword(data));
        if (res?.success) {
          newNotificationMessage(dispatch, {
            messageType: 'success',
            notificationMessage: 'The email was sent.',
          });
          setShowMessage(true);
        } else {
          newNotificationMessage(dispatch, {
            messageType: 'warning',
            notificationMessage:
              'There is no email to reset password.\nPlease try another one.',
          });
          setShowMessage(false);
        }
      } else {
        const res = await dispatch(checkEmail(data));
        if (res?.success) {
          newNotificationMessage(dispatch, {
            messageType: 'success',
            notificationMessage: 'The email was sent.',
          });
          setShowMessage(true);
        } else {
          newNotificationMessage(dispatch, {
            messageType: 'warning',
            notificationMessage:
              'This email is already in use.\nPlease try another one.',
          });
          setShowMessage(false);
        }
      }
    } catch (error) {
      console.log(
        'XX -> CheckEmailScreen.tsx:39 -> onSubmit -> error :',
        error,
      );
      navigation.popToTop();
    }
  };

  return (
    <FormProvider {...method}>
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.subTitle}>
            {!checkMode
              ? 'Please check your email to create\n a new account'
              : 'Please insert your email to\n reset your password'}
          </Text>
          <Text style={styles.subTitle2}>
            {showMessage &&
              `Check your inbox to validate the email\n and ${
                !checkMode ? 'create your account.' : 'reset your password.'
              }`}
          </Text>
        </View>
        <View style={styles.inputBox}>
          <Separator borderWidth={0} />
          <InputAuthField
            editable={!showMessage}
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
        </View>
        <View style={styles.buttonBox}>
          <Button
            disabled={showMessage}
            title={checkMode.includes('new') ? 'Check email' : 'Reset password'}
            onPress={handleSubmit(onSubmit)}
            buttonStyles={{ backgroundColor: colors.second }}
            textStyles={{ color: colors.textNgt, fontWeight: 600 }}
          />
        </View>
        <Separator borderWidth={0} />
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
              navigation.navigate('NewPasswordScreen', { token: null })
            }>
            <Text style={styles.gobackText}>new password</Text>
          </Pressable>
        </View>
      </View>
    </FormProvider>
  );
};

export default CheckEmailScreen;

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
      color: colors.light,
      fontWeight: 500,
      fontSize: 18,
    },
    subTitle2: {
      height: 65,
      textAlign: 'center',
      color: colors.lightgray,
      fontWeight: 300,
      fontSize: 16,
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
    errorEmail: {
      color: sharedColors.cancel,
      fontSize: 14,
      fontWeight: 500,
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
      color: colors.second,
    },
  });
