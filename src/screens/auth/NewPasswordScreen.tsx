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
                notificationMessage: 'Code expired. Please, try again!',
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
            notificationMessage:
              'There is no email checked. Please, try again!',
          }),
        );
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> NewPassword.tsx:46 -> useEffect -> error :', error);
      navigation.popToTop();
    }
  }, []);

  const onSubmit = async (data: FormNewDataProps) => {
    if (data.new_password !== data.confirm_password) {
      dispatch(
        setNotificationMessage({
          messageType: 'warning',
          notificationMessage: 'The two passwords must be the same.',
        }),
      );
    } else {
      const dataAPI = {
        email: email,
        password: data.new_password,
        token: emailToken,
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
            'XX -> NewPasswordScreen.tsx -> onSubmit -> error :',
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
            {'Enter a new password for your account'}
          </Text>
        </View>
        <View style={styles.inputBox}>
          <Separator borderWidth={0} />
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
          />
        </View>
        <View style={styles.buttonBox}>
          <Button
            title={newUser ? 'Register user' : 'New password'}
            onPress={handleSubmit(onSubmit)}
            buttonStyles={{ backgroundColor: colors.second }}
            textStyles={{ color: colors.textNgt, fontWeight: 600 }}
          />
        </View>
        <View style={styles.gobackBox}>
          <ButtonNoBorder
            title={'Go back to select other option!'}
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
