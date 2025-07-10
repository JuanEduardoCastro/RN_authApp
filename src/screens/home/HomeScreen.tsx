import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useMode } from '@context/ThemeContext';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import Separator from '@components/shared/Separator';
import ModeSwitchButton from '@components/shared/ModeSwitchButton';
import { HomeScreenNavigationProps } from 'src/navigators/types';
import Button from '@components/shared/Button';
import { logoutUser, useAppDispatch, useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';

const HomeScreen = ({ navigation, route }: HomeScreenNavigationProps) => {
  const { user } = useAppSelector(userAuth);
  const { mode, toggleMode } = useMode();
  const { colors, styles } = useStyles(createStyles);
  const dispatch = useAppDispatch();

  const handleLogut = async () => {
    console.log('LE DIO AL BOTON');
    console.log('en el user ???????', { email: user?.email });
    try {
      const res = await dispatch(logoutUser({ email: user?.email }));
      console.log('LA RESPUESTA', res);
      if (res?.success) {
        navigation.navigate('AuthNavigator', { screen: 'WelcomeScreen' });
      }
    } catch (error) {
      console.log('XX -> HomeScreen.tsx:26 -> handleLogut -> error :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout session" onPress={handleLogut} />
      <Separator border={false} />
      <Text style={styles.text}>HomeScreen</Text>
      <Separator border={false} />
      <ModeSwitchButton />
    </View>
  );
};

export default HomeScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: colors.text,
      fontSize: 20,
    },
  });
