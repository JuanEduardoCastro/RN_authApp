import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
// import { useDispatch } from 'react-redux';
// import { fetchUser } from 'src/store/authHook';
import InputAuthField from '@components/shared/InputAuthField';
import CheckBoxCustom from '@components/shared/CheckBoxCustom';

interface FormDataProps {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginScreen = () => {
  const methods = useForm<FormDataProps>();
  const { handleSubmit, control } = methods;
  // const dispatch = useDispatch();

  const onSubmit = (data: FormDataProps) => {
    console.log('hizo click', typeof data, data);
    // try {
    //   // const res = dispatch(fetchUser(data));
    // } catch (error) {
    //   console.log('XX -> LoginScreen.tsx:22 -> onSubmit -> error :', error);
    // }
  };
  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        <InputAuthField
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
        <InputAuthField
          name="password"
          label="Password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          placeholder="Enter your password"
          secureTextEntry
        />
        <CheckBoxCustom
          name="rememberMe"
          label="Remember me"
          control={control}
        />
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </View>
    </FormProvider>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
