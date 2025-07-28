import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useStyles from '@hooks/useStyles';
import { NewPasswordScreenNavigationProps } from 'src/navigators/types';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import Button from '@components/shared/Button';
import InputAuthField from '@components/shared/InputAuthField';
import { jwtDecode } from 'jwt-decode';
import {
  createUser,
  updatePassword,
  useAppDispatch,
  useAppSelector,
} from 'src/store/authHook';
import { CustomJwtPayload } from '@hooks/types';
import { userAuth } from 'src/store/authSlice';
import { newNotificationMessage } from '@utils/newNotificationMessage';
import Separator from '@components/shared/Separator';

interface FormNewDataProps {
  email: string;
  new_password: string;
  confirm_password: string;
}

const NewPasswordScreen = ({
  navigation,
  route,
}: NewPasswordScreenNavigationProps) => {
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
      // console.log('el token que llega', emailToken);
      if (emailToken !== null) {
        const decode = jwtDecode<CustomJwtPayload>(emailToken);
        const userEmail = decode.email;
        decode.isNew !== undefined && setNewUser(decode.isNew);

        setEmail(userEmail);
        if (decode.exp) {
          if (Date.now() / 1000 > decode.exp) {
            newNotificationMessage(dispatch, {
              messageType: 'warning',
              notificationMessage: 'Check email expired. Please, try again!',
            });
            !messageType &&
              navigation.navigate('CheckEmailScreen', {
                checkMode: 'new_password',
              });
            setTimeout(() => {
              navigation.navigate('CheckEmailScreen', {
                checkMode: 'new_password',
              });
            }, 2900);
          }
        }
      } else {
        navigation.popToTop();
        newNotificationMessage(dispatch, {
          messageType: 'warning',
          notificationMessage: 'There is no email checked. Please, try again!',
        });
      }
    } catch (error) {
      console.log('XX -> NewPassword.tsx:46 -> useEffect -> error :', error);
      navigation.popToTop();
    }
  }, []);

  const onSubmit = async (data: FormNewDataProps) => {
    if (data.new_password !== data.confirm_password) {
      /* Colocar esa alerta en el error de los fields */
      Alert.alert('The passwords must be the same');
    } else {
      const fullData = {
        email: email,
        password: data.new_password,
      };
      if (newUser) {
        try {
          const res = await dispatch(createUser(fullData, emailToken));
          if (res?.success) {
            newNotificationMessage(dispatch, {
              messageType: 'success',
              notificationMessage: 'User created successfully. ',
            });

            navigation.navigate('LoginScreen');
          } else {
            newNotificationMessage(dispatch, {
              messageType: 'error',
              notificationMessage: 'An error occurred. Please, try again!',
            });
          }
        } catch (error) {}
      } else {
        try {
          console.log('en el full data', fullData.password);
          const res = await dispatch(updatePassword(fullData, emailToken));
          if (res?.success) {
            newNotificationMessage(dispatch, {
              messageType: 'success',
              notificationMessage: 'New password saved.',
            });

            navigation.navigate('LoginScreen');
          } else {
            newNotificationMessage(dispatch, {
              messageType: 'error',
              notificationMessage: 'An error occurred. Please, try again!',
            });
          }
        } catch (error) {
          navigation.popToTop();
        }
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
          <Pressable style={{ padding: 8 }} onPress={() => navigation.goBack()}>
            <Text style={styles.gobackText}>
              Go back to select other option!
            </Text>
          </Pressable>
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
      textAlign: 'center',
      color: colors.light,
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
    gobackBox: {},
    gobackText: {
      color: colors.second,
    },
  });
