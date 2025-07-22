import { Alert, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useStyles from '@hooks/useStyles';
import { NewPasswordScreenNavigationProps } from 'src/navigators/types';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import Button from '@components/shared/Button';
import InputAuthField from '@components/shared/InputAuthField';
import { jwtDecode } from 'jwt-decode';
import { createUser, useAppDispatch } from 'src/store/authHook';
import { CustomJwtPayload } from '@hooks/types';

interface FormNewDataProps {
  email: string;
  new_password: string;
  confirm_password: string;
}

const NewPasswordScreen = ({
  navigation,
  route,
}: NewPasswordScreenNavigationProps) => {
  const { token } = route.params;
  const dispatch = useAppDispatch();
  const method = useForm<FormNewDataProps>();
  const { handleSubmit, control } = method;
  const { colors, styles } = useStyles(createStlyes);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (token !== null) {
        const decode = jwtDecode<CustomJwtPayload>(token);
        console.log('LO QUE VIENE EN EL TOKEN', decode);
        const userEmail = decode.email;
        setEmail(userEmail);
        if (decode.exp) {
          if (Date.now() / 1000 > decode.exp) {
            Alert.alert('esto se paso de tiempo');
          }
        }
      }
    } catch (error) {
      console.log('XX -> NewPassword.tsx:46 -> useEffect -> error :', error);
    }
  }, []);

  const onSubmit = async (data: FormNewDataProps) => {
    if (data.new_password !== data.confirm_password) {
      Alert.alert('The passwords must be the same');
    } else {
      const fullData = {
        email: email,
        password: data.new_password,
      };
      try {
        const res = await dispatch(createUser(fullData));
        console.log('el res -->', res);
        if (res?.success) {
          console.log('ENTRO AL IF');
          navigation.navigate('LoginScreen');
        }
      } catch (error) {}
      Alert.alert('User created succesfully');
      console.log('AGREGAR NUEVO USUARIO', fullData);
    }
  };

  return (
    <FormProvider {...method}>
      <View style={styles.container}>
        <View style={styles.inputBox}>
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
            secureTextEntry
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
            secureTextEntry
          />
        </View>
        <View style={styles.buttonBox}>
          <Button
            title={'Register user'}
            onPress={handleSubmit(onSubmit)}
            buttonStyles={{ backgroundColor: colors.second }}
            textStyles={{ color: colors.textNgt, fontWeight: 600 }}
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
  });
