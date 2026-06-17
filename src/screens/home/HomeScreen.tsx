import React, { useEffect, useState } from 'react';

import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import * as Keychain from 'react-native-keychain';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUnreadCount } from '@store/thunks';

import { HomeTabScreenProps } from '@navigation/types';

import HeaderHome from '@components/shared/HeaderHome';
import BiometricOptInModal from '@components/shared/modalSheet/BiometricOptInModal';
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
import {
  enableBiometricLogin,
  getBiometricType,
  hasBiometricBeenDeclined,
  isBiometricLoginEnabled,
  markBiometricDeclined,
} from '@utils/biometricAuth';

import { clearBiometricOffer, userAuth } from 'src/store/authSlice';

const HomeScreen = ({ navigation }: HomeTabScreenProps<'HomeScreen'>) => {
  useBackHandler();
  const { user, pendingBiometricOffer } = useAppSelector(userAuth);
  const { t } = useTranslation();
  const { handleLogout } = useLogoutUser();
  const { styles } = useStyles(createStyles);
  const dispatch = useAppDispatch();

  const [confirmLogoutModal, setConfirmLogoutModal] = useState(false);
  const [completeProfileModal, setCompleteProfileModal] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometryType, setBiometryType] =
    useState<Keychain.BIOMETRY_TYPE | null>(null);

  useEffect(() => {
    dispatch(fetchUnreadCount({ t }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user !== null) {
      if (user?.firstName?.length < 1) {
        setCompleteProfileModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pendingBiometricOffer) return;
    dispatch(clearBiometricOffer());
    const checkAndOffer = async () => {
      const type = await getBiometricType();
      const alreadyEnabled = await isBiometricLoginEnabled();
      const declined = await hasBiometricBeenDeclined();
      if (type && !alreadyEnabled && !declined) {
        setBiometryType(type);
        setShowBiometricModal(true);
      }
    };
    checkAndOffer();
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

  const handleBiometricEnabled = async () => {
    await enableBiometricLogin();
    setShowBiometricModal(false);
  };

  const handleBiometricDeclined = async () => {
    await markBiometricDeclined();
    setShowBiometricModal(false);
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
      <ModalSheet
        modalIsVisible={showBiometricModal}
        toggleSheet={() => setShowBiometricModal(false)}>
        <BiometricOptInModal
          biometricType={biometryType}
          onEnable={handleBiometricEnabled}
          onDecline={handleBiometricDeclined}
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
