/* Core libs & third parties libs */
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
import { checkEmail, resetPassword, useAppDispatch } from 'src/store/authHook';
/* Types */
import { AuthStackScreenProps } from 'src/navigators/types';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
/* Utilities & constants */
import { textVar } from '@constants/textVar';
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
  const dispatch = useAppDispatch();
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [showFocusTimer, setShowFocusTimer] = useState<boolean>(false);

  const onSubmit = async (data: CheckEmailProps) => {
    try {
      if (showFocusTimer) {
        setShowFocusTimer(false);
        timerRef.current.resetTimer();
      }
      if (checkMode.includes('new')) {
        const res = await dispatch(checkEmail(data));
        if (res?.success) {
          setShowMessage(true);
        } else {
          setShowMessage(false);
        }
      } else {
        const res = await dispatch(resetPassword(data));
        if (res?.success) {
          setShowMessage(true);
        } else {
          setShowMessage(false);
        }
      }
    } catch (error) {
      __DEV__ && console.log('XX -> CheckEmailScreen.tsx:56 -> error :', error);
      navigation.popToTop();
    }
  };

  const handleTimerProgress = (val: any) => {
    if (val === 0) {
      setShowFocusTimer(true);
    }
  };

  const handleTimerFinish = () => {
    // timerRef.current.resetTimer();
    // setShowFocusTimer(true);
  };

  const handleResendEmail = () => {
    setShowFocusTimer(false);
    timerRef.current.resetTimer();
  };

  return (
    <FormProvider {...method}>
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.subTitle}>
            {checkMode.includes('new')
              ? 'Please check your email to create\n a new account'
              : 'Please insert your email to\n reset your password'}
          </Text>
          <Text style={styles.subTitle2}>
            {showMessage &&
              `Check your inbox to validate the email\n and ${
                checkMode.includes('new')
                  ? 'create your account.'
                  : 'reset your password.'
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
        <Separator height={12} borderWidth={0} />
        <View style={{ height: 40 }}>
          {showMessage && (
            <Pressable
              disabled={!showFocusTimer}
              style={[
                { flexDirection: 'row' },
                styles.resendBox,
                showFocusTimer && styles.resetBoxOnFocus,
              ]}
              onPress={handleSubmit(onSubmit)}>
              <Text style={styles.resendText}>
                You can resend the email in:{' '}
              </Text>
              <CountDownTimer
                ref={timerRef}
                timestamp={20}
                timerOnProgress={(val: any) => handleTimerProgress(val)}
                timerCallback={() => handleTimerFinish()}
                containerStyle={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: colors.second,
                  display: showFocusTimer && 'none',
                }}
                textStyle={{
                  // fontSize: 14,
                  color: colors.lightgray,
                  letterSpacing: 1,
                }}
              />
              {showFocusTimer && <Text style={[styles.resendText]}>00:00</Text>}
            </Pressable>
          )}
        </View>
        <View style={styles.gobackBox}>
          <ButtonNoBorder
            title={'Go back to select other option!'}
            onPress={() => navigation.popToTop()}
          />
          {/* <Pressable
            style={{ padding: 8 }}
            onPress={() =>
              navigation.navigate('NewPasswordScreen', { token: null })
            }>
            <Text style={styles.gobackText}>new password</Text>
          </Pressable> */}
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
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    resendText: {
      ...textVar.mediumBold,
      color: colors.text,
      opacity: 0.8,
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
