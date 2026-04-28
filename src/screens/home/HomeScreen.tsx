/* Core libs & third parties libs */
import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
/* Custom components */
import Separator from '@components/shared/Separator';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import useBackHandler from '@hooks/useBackHandler';
/* Types */
import { TColors } from '@constants/types';
/* Utilities & constants */
import { userAuth } from 'src/store/authSlice';
import { textVar } from '@constants/textVar';
import { useAppSelector } from '@store/hooks';
import UserInfoCard from '@components/shared/UserInfoCard';
import HeaderHome from '@components/shared/HeaderHome';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModalSheet from '@components/shared/modalSheet/ModalSheet';
import LogoutModal from '@components/shared/modalSheet/LogoutModal';
import SessionExpCard from '@components/shared/SessionExpCard';
import useLogoutUser from '@hooks/useLogoutUser';
/* Assets */

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
