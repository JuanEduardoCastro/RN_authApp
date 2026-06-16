import React, { useEffect, useState } from 'react';

import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import * as Keychain from 'react-native-keychain';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@store/hooks';

import CustomModal from '@components/shared/bottomSheet/CustomModal';
import ListCard from '@components/shared/ListCard';
import LanguagePicker from '@components/shared/locale/LanguagePicker';
import MailContactBox from '@components/shared/MailContactBox';
import BiometricConfirmModal from '@components/shared/modalSheet/BiometricConfirmModal';
import LogoutModal from '@components/shared/modalSheet/LogoutModal';
import ModalSheet from '@components/shared/modalSheet/ModalSheet';
import NotificationConfirmModal from '@components/shared/modalSheet/NotificationConfirmModal';
import ModeSwitchButton from '@components/shared/ModeSwitchButton';
import Separator from '@components/shared/Separator';

import useBiometricAuth from '@hooks/useBiometricAuth';
import useLogoutUser from '@hooks/useLogoutUser';
import useStyles from '@hooks/useStyles';
import { useMode } from '@context/ModeContext';

import {
  BellIcon,
  CheckIcon,
  CircleFullIcon,
  FaceIdIcon,
  LanguageIcon,
  MessageIcon,
  PowerIcon,
  ProfileIcon,
  TouchIdIcon,
} from '@assets/svg/icons';

import { moderateScale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';
import {
  disableBiometricLogin,
  enableBiometricLogin,
} from '@utils/biometricAuth';
import {
  enableNotifications,
  getNotificationsEnabled,
} from '@utils/notifications/notificationPreferences';

import { SettingsStackScreenProps } from 'src/navigation/types';
import { setNotificationMessage, userAuth } from 'src/store/authSlice';

const SettingsScreen = ({
  navigation,
}: SettingsStackScreenProps<'SettingsScreen'>) => {
  const { user, token } = useAppSelector(userAuth);
  const { handleLogout } = useLogoutUser();
  const { setColorTheme, themeName, toggleMode } = useMode();
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const {
    biometricType,
    isEnabled: isBiometricEnabled,
    isAvailable: biometricAvailable,
    recheck,
  } = useBiometricAuth();

  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [confirmLogoutModal, setConfirmLogoutModal] = useState(false);
  const [biometricConfirmModal, setBiometricConfirmModal] = useState(false);
  const [pendingBiometricAction, setPendingBiometricAction] = useState<
    'enable' | 'disable'
  >('enable');

  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifConfirmModal, setNotifConfirmModal] = useState(false);
  const [pendingNotifAction, setPendingNotifAction] = useState<
    'enable' | 'disable'
  >('enable');

  useEffect(() => {
    getNotificationsEnabled().then(setNotifEnabled);
  }, []);

  const handleNotifToggle = (value: boolean) => {
    setPendingNotifAction(value ? 'enable' : 'disable');
    setNotifConfirmModal(true);
  };

  const handleNotifConfirm = async () => {
    if (!token) return;
    if (pendingNotifAction === 'enable') {
      await enableNotifications(token);
      setNotifEnabled(true);
      dispatch(
        setNotificationMessage({
          messageType: 'success',
          notificationMessage: t('notifications-enabled-success'),
        }),
      );
    } else {
      await enableNotifications(token);
      setNotifEnabled(false);
      dispatch(
        setNotificationMessage({
          messageType: 'information',
          notificationMessage: t('notifications-disabled-info'),
        }),
      );
    }
    setNotifConfirmModal(false);
  };

  const toggleNotifConfirmModal = () => {
    setNotifConfirmModal(!notifConfirmModal);
  };

  const handleBiometricToggle = (value: boolean) => {
    setPendingBiometricAction(value ? 'enable' : 'disable');
    setBiometricConfirmModal(true);
  };

  const handleBiometricconfirm = async () => {
    if (pendingBiometricAction === 'enable') {
      const success = await enableBiometricLogin();
      if (success) {
        dispatch(
          setNotificationMessage({
            messageType: 'success',
            notificationMessage: t('biometric-enabled-success'),
          }),
        );
      }
    } else {
      await disableBiometricLogin();
      dispatch(
        setNotificationMessage({
          messageType: 'information',
          notificationMessage: t('biometric-disabled-info'),
        }),
      );
    }
    await recheck();
    setBiometricConfirmModal(false);
  };

  const toggleBiometricConfirmModal = () => {
    setBiometricConfirmModal(!biometricConfirmModal);
  };

  const toggleSheet = () => {
    setIsVisible(!isVisible);
  };

  const toggleModalSheet = () => {
    setConfirmLogoutModal(!confirmLogoutModal);
  };

  const handleConfirmLogout = async () => {
    toggleModalSheet();
    await handleLogout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titlebox}>
        <Text style={styles.titleText}>{t('settings-title')}</Text>
      </View>
      <Separator border={false} height={24} />
      {/* eslint-disable react-native/no-inline-styles */}
      <View
        style={[
          styles.listBox,
          { paddingBottom: Platform.OS === 'ios' ? 60 : 80 },
        ]}>
        <ScrollView
          style={styles.listScroll}
          showsVerticalScrollIndicator={false}>
          <ListCard
            title={t('logout-button')}
            onPress={toggleModalSheet}
            icon={<PowerIcon width={24} height={24} color={colors.text} />}
          />
          <Separator height={40} />
          <ListCard
            title={t('profile-button')}
            onPress={() => navigation.navigate('ProfileScreen')}
            icon={<ProfileIcon width={24} height={24} color={colors.text} />}
          />
          <ListCard
            title={t('another-item-button')}
            onPress={() =>
              dispatch(
                setNotificationMessage({
                  messageType: 'information',
                  notificationMessage: t('information-another-screen'),
                }),
              )
            }
            icon={<CheckIcon width={20} height={20} color={colors.text} />}
          />
          {user?.roles === 'superadmin' && (
            <ListCard
              title={t('admin-button')}
              onPress={() => navigation.navigate('AdminScreen')}
              icon={<MessageIcon width={20} height={20} color={colors.text} />}
            />
          )}
          <ListCard
            title={t('language-button')}
            onPress={() => setIsVisible(true)}
            icon={<LanguageIcon width={22} height={22} color={colors.text} />}
          />
          {biometricAvailable && (
            <ListCard
              title={t('biometric-toggle-button')}
              onPress={() => handleBiometricToggle(!isBiometricEnabled)}
              icon={
                biometricType === Keychain.BIOMETRY_TYPE.FACE_ID ? (
                  <FaceIdIcon width={24} height={24} color={colors.text} />
                ) : (
                  <TouchIdIcon width={22} height={22} color={colors.text} />
                )
              }
              checkBox={isBiometricEnabled}
            />
          )}

          <ListCard
            title={t('notifications-toggle-button')}
            onPress={() => handleNotifToggle(!notifEnabled)}
            icon={<BellIcon width={22} height={22} color={colors.text} />}
            checkBox={notifEnabled}
          />

          <Separator height={40} />
          <Pressable onPress={toggleMode} style={styles.modeBox}>
            <ModeSwitchButton />
            <Text style={styles.modeText}>{t('mode-switch-button')}</Text>
          </Pressable>
          <ListCard
            title={t('luxury-button')}
            onPress={() => setColorTheme('luxury')}
            icon={<CircleFullIcon width={14} height={14} color={'#7646c9'} />}
            checkBox={themeName === 'luxury'}
          />
          <ListCard
            title={t('calm-button')}
            onPress={() => setColorTheme('calm')}
            icon={<CircleFullIcon width={14} height={14} color={'#41737c'} />}
            checkBox={themeName === 'calm'}
          />
          <ListCard
            title={t('gold-button')}
            onPress={() => setColorTheme('gold')}
            icon={<CircleFullIcon width={14} height={14} color={'#FFC337'} />}
            checkBox={themeName === 'gold'}
          />
          <ListCard
            title={t('passion-button')}
            onPress={() => setColorTheme('passion')}
            icon={<CircleFullIcon width={14} height={14} color={'#CD6D94'} />}
            checkBox={themeName === 'passion'}
          />
        </ScrollView>
        <MailContactBox title="authorization.demo.app@gmail.com" />
      </View>
      {/* eslint-enable react-native/no-inline-styles */}
      <CustomModal modalIsVisible={isVisible} toggleSheet={toggleSheet}>
        <LanguagePicker toggleSheet={toggleSheet} />
      </CustomModal>
      <ModalSheet
        modalIsVisible={confirmLogoutModal}
        toggleSheet={toggleModalSheet}>
        <LogoutModal
          toggleModalSheet={toggleModalSheet}
          handleLogut={handleConfirmLogout}
        />
      </ModalSheet>
      <ModalSheet
        modalIsVisible={biometricConfirmModal}
        toggleSheet={toggleBiometricConfirmModal}>
        <BiometricConfirmModal
          action={pendingBiometricAction}
          toggleModalSheet={toggleBiometricConfirmModal}
          onConfirm={handleBiometricconfirm}
        />
      </ModalSheet>
      <ModalSheet
        modalIsVisible={notifConfirmModal}
        toggleSheet={toggleNotifConfirmModal}>
        <NotificationConfirmModal
          action={pendingNotifAction}
          toggleModalSheet={toggleNotifConfirmModal}
          onConfirm={handleNotifConfirm}
        />
      </ModalSheet>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    titlebox: {
      width: SCREEN.width90,
      height: SCREEN.heightFixed * 46,
      justifyContent: 'center',
    },
    titleText: {
      ...textVar.xlargeBold,
      color: colors.text,
    },
    listBox: {
      flex: 1,
    },
    listScroll: {
      width: SCREEN.width90,
      height: SCREEN.heightFixed * 200,
      // gap: 8,
    },
    modeBox: {
      flexDirection: 'row',
      height: SCREEN.heightFixed * 46,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: moderateScale(10),
      paddingHorizontal: 8,
    },
    modeText: {
      ...textVar.base,
      color: colors.text,
    },
    modalText: {
      ...textVar.mediumBold,
      color: colors.text,
      textAlign: 'center',
    },
  });
