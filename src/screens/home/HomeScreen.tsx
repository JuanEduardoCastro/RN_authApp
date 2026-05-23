import React, { useEffect, useState } from 'react';

import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUnreadCount } from '@store/thunks';

import { HomeTabScreenProps } from '@navigation/types';

import HeaderHome from '@components/shared/HeaderHome';
import CompleteProfileModal from '@components/shared/modalSheet/CompleteProfileModal';
import LogoutModal from '@components/shared/modalSheet/LogoutModal';
import ModalSheet from '@components/shared/modalSheet/ModalSheet';
import Separator from '@components/shared/Separator';
import SessionExpCard from '@components/shared/SessionExpCard';
import UserInfoCard from '@components/shared/UserInfoCard';

import useBackHandler from '@hooks/useBackHandler';
import useLogoutUser from '@hooks/useLogoutUser';
import useStyles from '@hooks/useStyles';

import { TColors } from '@constants/types';

import { userAuth } from 'src/store/authSlice';

const HomeScreen = ({ navigation }: HomeTabScreenProps<'HomeScreen'>) => {
  useBackHandler();
  const { user } = useAppSelector(userAuth);
  const { t } = useTranslation();
  const { handleLogout } = useLogoutUser();
  const { styles } = useStyles(createStyles);
  const dispatch = useAppDispatch();

  const [confirmLogoutModal, setConfirmLogoutModal] = useState(false);
  const [completeProfileModal, setCompleteProfileModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUnreadCount({ t }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user !== null) {
      if (user!.firstName.length < 1) {
        setCompleteProfileModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleModalSheet = () => {
    setConfirmLogoutModal(!confirmLogoutModal);
  };

  const handleConfirmLogout = async () => {
    toggleModalSheet();
    await handleLogout();
  };

  const handlePressToProfile = () => {
    navigation.navigate('SettingsNavigator', {
      screen: 'ProfileScreen',
      initial: false,
    });
    setCompleteProfileModal(false);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <HeaderHome toggleModalSheet={toggleModalSheet} />
        <Separator border={false} />
        <UserInfoCard user={user!} onPress={handlePressToProfile} />
        <Separator border={false} />
        <SessionExpCard />
      </SafeAreaView>
      <ModalSheet
        modalIsVisible={confirmLogoutModal}
        toggleSheet={toggleModalSheet}>
        <LogoutModal
          toggleModalSheet={toggleModalSheet}
          handleLogut={handleConfirmLogout}
        />
      </ModalSheet>
      <ModalSheet
        modalIsVisible={completeProfileModal}
        toggleSheet={() => setCompleteProfileModal(false)}>
        <CompleteProfileModal
          toggleModalSheet={() => setCompleteProfileModal(false)}
          handleGoToProfile={handlePressToProfile}
        />
      </ModalSheet>
    </>
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
  });
