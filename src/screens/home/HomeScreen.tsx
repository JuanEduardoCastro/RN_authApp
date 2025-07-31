import { StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import Separator from '@components/shared/Separator';
import ModeSwitchButton from '@components/shared/ModeSwitchButton';
import { HomeScreenNavigationProps } from 'src/navigators/types';
import Button from '@components/shared/Button';
import { logoutUser, useAppDispatch, useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';
import { newNotificationMessage } from '@utils/newNotificationMessage';
import useTimeExpired from '@hooks/useTimeExpired';
import CountDownTimer from 'react-native-countdown-timer-hooks';
import { SCREEN } from '@constants/sizes';
import { withDecay } from 'react-native-reanimated';

const HomeScreen = ({ navigation, route }: HomeScreenNavigationProps) => {
  const timerRef = useRef<any>(null);
  const { user } = useAppSelector(userAuth);
  const { accessTokenTimer, refreshTokenTimer } = useTimeExpired();
  const { colors, styles } = useStyles(createStyles);
  const dispatch = useAppDispatch();

  const handleLogut = async () => {
    try {
      const res = await dispatch(logoutUser({ email: user?.email }));
      if (res?.success) {
        navigation.navigate('AuthNavigator', { screen: 'WelcomeScreen' });
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> HomeScreen.tsx:26 -> handleLogut -> error :', error);
    }
  };

  const createErrorMesage = () => {
    newNotificationMessage(dispatch, {
      messageType: 'error',
      notificationMessage: 'This is a new error!! ',
    });
  };

  const handleTimerProgress = (val: any) => {};

  return (
    <View style={styles.container}>
      <Button title="Logout session" onPress={handleLogut} />
      <Separator border={false} />
      <Button title="Create new error" onPress={createErrorMesage} />
      <Separator border={false} />
      <Text style={styles.text}>HomeScreen</Text>
      <Separator border={false} />
      <ModeSwitchButton />
      <Separator border={false} />
      {/* <View style={styles.timerBox}>
        <Text style={styles.timerText}>
          This is the time you have left until your session is renewed:
        </Text>
        <CountDownTimer
          ref={timerRef}
          timestamp={300}
          timerOnProgress={(val: any) => handleTimerProgress(val)}
          timerCallback={() => console.log('termino=?????')}
          containerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: colors.second,
            // display: showFocusTimer && 'none',
          }}
          textStyle={{
            // fontSize: 14,
            color: colors.text,
            letterSpacing: 1,
          }}
        />
      </View> */}
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
    timerBox: {
      width: SCREEN.width75,
      // flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timerText: {
      color: colors.text,
    },
  });
