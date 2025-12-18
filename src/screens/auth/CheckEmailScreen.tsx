/* Core libs & third parties libs */
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CountDownTimer from 'react-native-countdown-timer-hooks';
/* Custom components */
import InputAuthField from '@components/shared/InputAuthField';
import Separator from '@components/shared/Separator';
import Button from '@components/shared/Button';
import ButtonNoBorder from '@components/shared/ButtonNoBorder';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
/* Types */
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
import { AuthStackScreenProps } from '@navigation/types';
import { setNotificationMessage } from '@store/authSlice';
import { DataAPI } from '@store/types';
import { useTranslation } from 'react-i18next';
import DismissKeyboardOnClick from '@components/shared/keyboard/DismissKeyboardOnClick';
import { useAppDispatch } from '@store/hooks';
import { checkEmail, resetPassword } from '@store/thunks';
/* Assets */

interface CheckEmailProps {
  email: string;
}

const CheckEmailScreen = ({
  navigation,
  route,
}: AuthStackScreenProps<'CheckEmailScreen'>) => {
  const timerRef = useRef<any>(null);
  const { checkMode } = route.params;
  const method = useForm<CheckEmailProps>();
  const { handleSubmit, control } = method;
  const { colors, styles } = useStyles(createStlyes);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [canResend, setCanResend] = useState<boolean>(false);

  const onSubmit = async (data: CheckEmailProps) => {
    Keyboard.dismiss();
    try {
      if (canResend) {
        setCanResend(false);
        timerRef.current.resetTimer();
      }

      const actionToDispatch = checkMode.includes('new')
        ? checkEmail({ ...data, t } as DataAPI)
        : resetPassword({ ...data, t } as DataAPI);

      const res = await dispatch(actionToDispatch).unwrap();

      if (res?.success) {
        setIsEmailSent(true);
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage: t('success-email-sent'),
          }),
        );
      }
    } catch (error) {
      __DEV__ &&
        console.log(
          'XX -> CheckEmailScreen.tsx:65 -> onSubmit -> error :',
          error,
        );
      // Errors are now handled by the rejected case in the extraReducers,
      // which will display a notification.
    }
  };

  const handleTimerProgress = (val: any) => {
    if (val === 0) {
      setCanResend(true);
    }
  };

  // const handleTimerFinish = () => {
  //   // timerRef.current.resetTimer();
  //   // setShowFocusTimer(true);
  // };

  // const handleResendEmail = () => {
  //   setShowFocusTimer(false);
  //   timerRef.current.resetTimer();
  // };

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
                {checkMode.includes('new')
                  ? t('check-email-title')
                  : t('reset-password-title')}
              </Text>
              <Text style={styles.subTitle2}>
                {isEmailSent &&
                  `${t('check-inbox')} ${
                    checkMode.includes('new')
                      ? t('create-account')
                      : t('reset-password')
                  }`}
              </Text>
            </View>
            <View style={styles.inputBox}>
              <Separator borderWidth={0} />
              <InputAuthField
                editable={!isEmailSent}
                inputStyles={styles.textinput}
                name="email"
                label={t('email-label')}
                control={control}
                rules={{
                  required: t('email-required'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('email-invalid'),
                  },
                }}
                placeholder={t('enter-email-placeholder')}
              />
            </View>
            <View style={styles.buttonBox}>
              <Button
                disabled={isEmailSent}
                title={
                  checkMode.includes('new')
                    ? t('check-email-button')
                    : t('reset-password-button')
                }
                onPress={handleSubmit(onSubmit)}
                buttonStyles={styles.button}
                textStyles={styles.buttonText}
              />
            </View>
            <Separator height={12} borderWidth={0} />
            <View style={{ height: 40 }}>
              {isEmailSent && (
                <Pressable
                  disabled={!canResend}
                  style={[
                    { flexDirection: 'row' },
                    styles.resendBox,
                    canResend && styles.resetBoxOnFocus,
                  ]}
                  onPress={handleSubmit(onSubmit)}>
                  <Text style={styles.resendText}>
                    {t('resend-email-button')}
                  </Text>
                  <CountDownTimer
                    ref={timerRef}
                    timestamp={180}
                    timerOnProgress={handleTimerProgress}
                    timerCallback={() => setCanResend(true)}
                    containerStyle={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: canResend ? 'none' : 'flex',
                    }}
                    textStyle={{
                      ...textVar.mediumBold,
                      color: colors.text,
                      opacity: 0.5,
                      letterSpacing: 0.8,
                    }}
                  />
                  {canResend && <Text style={[styles.resendText]}>00:00</Text>}
                </Pressable>
              )}
            </View>
            <View style={styles.gobackBox}>
              <ButtonNoBorder
                title={t('go-back-button')}
                onPress={() => navigation.popToTop()}
              />
              {/* <Pressable
            style={{ padding: 8 }}
            onPress={() =>
              navigation.navigate('NewPasswordScreen', { emailToken: null })
            }>
            <Text style={styles.gobackText}> justDev -- NEW PASSWPORD </Text>
          </Pressable> */}
            </View>
          </View>
        </DismissKeyboardOnClick>
      </KeyboardAvoidingView>
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
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      marginBottom: -10,
    },
    subTitle: {
      ...textVar.largeBold,
      textAlign: 'center',
      color: colors.text,
    },
    subTitle2: {
      ...textVar.base,
      height: 65,
      textAlign: 'center',
      color: colors.text,
      opacity: 0.8,
    },
    resendBox: {
      width: SCREEN.widthFixed * 280,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    resetBoxOnFocus: {
      width: SCREEN.widthFixed * 280,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.second,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    resendText: {
      ...textVar.mediumBold,
      color: colors.text,
      opacity: 0.5,
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
