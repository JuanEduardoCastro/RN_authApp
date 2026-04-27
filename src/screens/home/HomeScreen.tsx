/* Core libs & third parties libs */
import { StyleSheet, Text } from 'react-native';
import React, { useState } from 'react';
/* Custom components */
import Separator from '@components/shared/Separator';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import useBackHandler from '@hooks/useBackHandler';
/* Types */
import { TColors } from '@constants/types';
import { HomeTabScreenProps } from 'src/navigation/types';
/* Utilities & constants */
import { userAuth } from 'src/store/authSlice';
import { SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import UserInfoCard from '@components/shared/UserInfoCard';
import HeaderHome from '@components/shared/HeaderHome';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModalSheet from '@components/shared/modalSheet/ModalSheet';
import LogoutModal from '@components/shared/modalSheet/LogoutModal';
import { logoutUser } from '@store/thunks';
import { LogoutUserPayload } from '@store/types';
import SessionExpCard from '@components/shared/SessionExpCard';
/* Assets */

const HomeScreen = ({ navigation }: HomeTabScreenProps<'HomeScreen'>) => {
  useBackHandler();
  const { user } = useAppSelector(userAuth);

  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [confirmLogoutModal, setConfirmLogoutModal] = useState(false);

  const toggleModalSheet = () => {
    setConfirmLogoutModal(!confirmLogoutModal);
  };

  const handleLogut = async () => {
    try {
      const res = await dispatch(
        logoutUser({ email: user?.email, t } as LogoutUserPayload),
      ).unwrap();
      if (res?.success) {
        navigation.navigate('AuthNavigator', { screen: 'WelcomeScreen' });
        toggleModalSheet();
      }
    } catch (error) {
      toggleModalSheet();
      __DEV__ &&
        console.log(
          'XX -> SettingsScreen.tsx:74 -> handleLogut -> error :',
          error,
        );
      navigation.navigate('AuthNavigator', { screen: 'WelcomeScreen' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome toggleModalSheet={toggleModalSheet} />
      <Separator border={false} />
      <UserInfoCard user={user!} />
      <Separator border={false} />
      <SessionExpCard />

      {/* <Button title={t('new-error-button')} onPress={createErrorMesage} />
      <Separator border={false} /> */}
      {/* <Text style={styles.text}>Home Screen</Text>
      <Separator border={false} /> */}
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
      <ModalSheet
        modalIsVisible={confirmLogoutModal}
        toggleSheet={toggleModalSheet}>
        <LogoutModal
          toggleModalSheet={toggleModalSheet}
          handleLogut={handleLogut}
        />
      </ModalSheet>
    </SafeAreaView>
  );
};

export default HomeScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'flex-start',
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
