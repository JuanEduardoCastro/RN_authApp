/* Core libs & third parties libs */
import { StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
/* Custom components */
import Separator from '@components/shared/Separator';
import Button from '@components/shared/Button';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import { useAppDispatch, useAppSelector } from 'src/store/authHook';
import useTimeExpired from '@hooks/useTimeExpired';
import useBackHandler from '@hooks/useBackHandler';
/* Types */
import { TColors } from '@constants/types';
import { HomeTabScreenProps } from 'src/navigation/types';
/* Utilities & constants */
import { setNotificationMessage, userAuth } from 'src/store/authSlice';
import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
/* Assets */

const HomeScreen = ({
  navigation,
  route,
}: HomeTabScreenProps<'HomeScreen'>) => {
  useBackHandler();
  const timerRef = useRef<any>(null);
  const { user } = useAppSelector(userAuth);
  const { accessTokenTimer, refreshTokenTimer } = useTimeExpired();
  const { colors, styles } = useStyles(createStyles);
  const dispatch = useAppDispatch();

  const createErrorMesage = () => {
    dispatch(
      setNotificationMessage({
        messageType: 'error',
        notificationMessage: 'This is notificacion test! ',
      }),
    );
  };

  const handleTimerProgress = (val: any) => {};

  return (
    <View style={styles.container}>
      <Button title="Create new error" onPress={createErrorMesage} />
      <Separator border={false} />
      <Text style={styles.text}>Home Screen</Text>
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
      ...textVar.xlargeBold,
      color: colors.text,
    },
    timerBox: {
      width: SCREEN.width75,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timerText: {
      ...textVar.base,
      color: colors.text,
    },
  });
