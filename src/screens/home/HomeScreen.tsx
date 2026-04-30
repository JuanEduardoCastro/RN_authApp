import React, { useState } from 'react';

import { StyleSheet } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppSelector } from '@store/hooks';

import HeaderHome from '@components/shared/HeaderHome';
import LogoutModal from '@components/shared/modalSheet/LogoutModal';
import ModalSheet from '@components/shared/modalSheet/ModalSheet';
import Separator from '@components/shared/Separator';
import SessionExpCard from '@components/shared/SessionExpCard';
import UserInfoCard from '@components/shared/UserInfoCard';

import useBackHandler from '@hooks/useBackHandler';
import useLogoutUser from '@hooks/useLogoutUser';
import useStyles from '@hooks/useStyles';

import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import { userAuth } from 'src/store/authSlice';

const HomeScreen = () => {
  useBackHandler();
  const { user } = useAppSelector(userAuth);
  const { handleLogout } = useLogoutUser();
  const { styles } = useStyles(createStyles);

  const [confirmLogoutModal, setConfirmLogoutModal] = useState(false);

  const toggleModalSheet = () => {
    setConfirmLogoutModal(!confirmLogoutModal);
  };

  const handleConfirmLogout = async () => {
    toggleModalSheet();
    await handleLogout();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <HeaderHome toggleModalSheet={toggleModalSheet} />
        <Separator border={false} />
        <UserInfoCard user={user!} />
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
    text: {
      ...textVar.xlargeBold,
      color: colors.text,
    },
  });
