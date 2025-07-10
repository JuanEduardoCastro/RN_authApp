import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CheckEmailScreenNavigationProps } from 'src/navigators/types';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import InputAuthField from '@components/shared/InputAuthField';
import Button from '@components/shared/Button';
import { checkEmail, useAppDispatch, useAppSelector } from 'src/store/authHook';
import { setError, userAuth } from 'src/store/authSlice';
import Separator from '@components/shared/Separator';
import { COLOR, sharedColors } from '@constants/colors';

interface CheckEmailProps {
  email: string;
}

const CheckEmailScreen = ({
  navigation,
  route,
}: CheckEmailScreenNavigationProps) => {
  const method = useForm<CheckEmailProps>();
  const { handleSubmit, control } = method;
  const { colors, styles } = useStyles(createStlyes);
  const dispatch = useAppDispatch();
  const { error } = useAppSelector(userAuth);

  const onSubmit = async (data: CheckEmailProps) => {
    try {
      const res = await dispatch(checkEmail(data));
      if (res?.success) {
        Alert.alert(res?.message || '');
        navigation.navigate('NewPasswordScreen', { deepLink: null });
      } else {
        // Alert.alert(res?.message || '');
        dispatch(setError(res?.message));
      }
    } catch (error) {
      console.log(
        'XX -> CheckEmailScreen.tsx:39 -> onSubmit -> error :',
        error,
      );
    }
  };

  return (
    <FormProvider {...method}>
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <Text style={styles.errorEmail}>
            {error !== null && (error as string)}
          </Text>
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
        </View>
        <View style={styles.buttonBox}>
          <Button
            title={'Check email'}
            onPress={handleSubmit(onSubmit)}
            buttonStyles={{ backgroundColor: colors.second }}
            textStyles={{ color: colors.textNgt, fontWeight: 600 }}
          />
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
  });
