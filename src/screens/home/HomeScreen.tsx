/* Core libs & third parties libs */
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
/* Custom components */
import Separator from '@components/shared/Separator';
import Button from '@components/shared/Button';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import { useAppDispatch } from 'src/store/authHook';
import useBackHandler from '@hooks/useBackHandler';
/* Types */
import { TColors } from '@constants/types';
import { HomeTabScreenProps } from 'src/navigation/types';
/* Utilities & constants */
import { setNotificationMessage } from 'src/store/authSlice';
import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
import { useTranslation } from 'react-i18next';
/* Assets */

const HomeScreen = ({}: HomeTabScreenProps<'HomeScreen'>) => {
  useBackHandler();
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const createErrorMesage = () => {
    dispatch(
      setNotificationMessage({
        messageType: 'error',
        notificationMessage: t('error-test-message'),
      }),
    );
  };

  return (
    <View style={styles.container}>
      <Button title={t('new-error-button')} onPress={createErrorMesage} />
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
