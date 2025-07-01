import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CheckEmailScreenNavigationProps } from 'src/navigators/types';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/screenSize';
import InputAuthField from '@components/shared/InputAuthField';
import Button from '@components/shared/Button';

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

  const onSubmit = (data: CheckEmailProps) => {
    console.log('CHECKEAR EMAIL', data);
    if (data.email !== 'test@mail.com') {
      navigation.navigate('SigninScreen', { email: data.email });
    } else {
      Alert.alert('This email is alredy use');
    }
  };

  return (
    <FormProvider {...method}>
      <View style={styles.container}>
        <View style={styles.inputBox}>
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
    textinput: {
      borderColor: colors.second,
    },
    buttonBox: {
      width: SCREEN.widthFixed * 240,
      paddingVertical: 12,
    },
  });
