/* Core libs & third parties libs */
import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
/* Custom components */
import Separator from '@components/shared/Separator';
import BGGradient from '@components/shared/BGGradient';
import Button from '@components/shared/Button';
import ButtonWithIcon from '@components/shared/ButtonWithIcon';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import useBackHandler from '@hooks/useBackHandler';
import { appleLogin, githubLogin, googleLogin } from 'src/store/otherAuthHooks';
/* Types */
import { TColors } from '@constants/types';
import { AuthStackScreenProps } from '@navigation/types';
/* Utilities & constants */
import { SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { GITHUB_CLIENT_ID, IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env';
/* Assets */
import {
  AppleIcon,
  FaceIdIcon,
  GithubIcon,
  GoogleIcon,
  MailIcon,
  TouchIdIcon,
} from '@assets/svg/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@store/hooks';
import { setNotificationMessage } from '@store/authSlice';
import useBiometricAuth from '@hooks/useBiometricAuth';
import {
  authenticateWithBiometrics,
  enableBiometricLogin,
  getBiometricType,
  hasBiometricBeenDeclined,
  isBiometricLoginEnabled,
  markBiometricDeclined,
} from '@utils/biometricAuth';
import { KeychainService, secureGetStorage } from '@utils/secureStorage';
import { validateRefreshToken } from '@store/thunks';
import * as Keychain from 'react-native-keychain';
import ModalSheet from '@components/shared/modalSheet/ModalSheet';
import BiometricOptInModal from '@components/shared/modalSheet/BiometricOptInModal';

if (!WEB_CLIENT_ID || !IOS_CLIENT_ID) {
  throw new Error('❌ Missing Google OAuth credentials!');
}

if (!GITHUB_CLIENT_ID) {
  throw new Error('❌ Missing GitHub auth credential!');
}

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  offlineAccess: false,
  scopes: ['profile', 'email'],
});

const WelcomeScreen = ({
  navigation,
}: AuthStackScreenProps<'WelcomeScreen'>) => {
  useBackHandler();
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const { isEnabled, biometricType } = useBiometricAuth();
  const dispatch = useAppDispatch();
  const [googleButtonDisabled, setGoogleButtonDisabled] = useState(false);
  const [githubButtonDisabled, setGithubButtonDisabled] = useState(false);
  const [appleButtonDisabled, setAppleButtonDisabled] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [biometryType, setBiometryType] =
    useState<Keychain.BIOMETRY_TYPE | null>(null);
  const [biometricButtonDisabled, setBiometricButtonDisabled] = useState(false);

  const checkAndOfferBiometric = async () => {
    const type = await getBiometricType();
    const alreadyEnabled = await isBiometricLoginEnabled();
    const declined = await hasBiometricBeenDeclined();
    if (type && !alreadyEnabled && !declined) {
      setBiometryType(type);
      setShowBiometricModal(true);
    } else {
      navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
    }
  };

  const handleBiometricEnable = async () => {
    await enableBiometricLogin();
    setShowBiometricModal(false);
    navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
  };

  const handleBiometricDecline = async () => {
    await markBiometricDeclined();
    setShowBiometricModal(false);
    navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
  };

  const handleGoogleOriginalSignin = async () => {
    setGoogleButtonDisabled(true);
    try {
      const playServicesAvailable = await GoogleSignin.hasPlayServices();
      if (!playServicesAvailable) {
        await GoogleSignin.signOut();
        setGoogleButtonDisabled(false);
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: t('error-google-play-services'),
          }),
        );
        return;
      }
      const googleResponse = await GoogleSignin.signIn();
      if (!googleResponse) {
        await GoogleSignin.signOut();
        setGoogleButtonDisabled(false);
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: t('error-google-signin'),
          }),
        );
        throw new Error();
      }
      const { idToken } = await GoogleSignin.getTokens();

      const data = { idToken, t };
      const res = await dispatch(googleLogin(data)).unwrap();

      if (res?.success) {
        await checkAndOfferBiometric();
        // navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
      }
      setGoogleButtonDisabled(false);
    } catch (error) {
      setGoogleButtonDisabled(false);
      __DEV__ &&
        console.log(
          'XX -> WelcomeScreen.tsx:87 -> handleGoogleOriginalSignin -> error :',
          error,
        );
    }
  };

  const handleGitHubLogin = async () => {
    setGithubButtonDisabled(true);
    try {
      const data = { t };
      const res = await dispatch(githubLogin(data)).unwrap();
      if (res?.success) {
        await checkAndOfferBiometric();
        // navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
      }
      setGithubButtonDisabled(false);
    } catch (error) {
      setGithubButtonDisabled(false);
      __DEV__ &&
        console.log(
          'XX -> WelcomeScreen.tsx:105 -> handleGithubSignin -> error :',
          error,
        );
    }
  };

  const handleAppleLogin = async () => {
    setAppleButtonDisabled(true);
    try {
      const data = { t };
      const res = await dispatch(appleLogin(data)).unwrap();
      if (res?.success) {
        await checkAndOfferBiometric();
        // navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
      }
      setAppleButtonDisabled(false);
    } catch (error) {
      setAppleButtonDisabled(false);
      __DEV__ &&
        console.log(
          'XX -> WelcomeScreen.tsx:105 -> handleAppleLogin -> error :',
          error,
        );
    }
  };

  const handleBiometricLogin = async () => {
    setBiometricButtonDisabled(true);
    try {
      const authenticated = await authenticateWithBiometrics(
        t('biometric-prompt-title'),
        t('biometric-cancel'),
      );
      if (!authenticated) {
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: t('error-biometric-auth'),
          }),
        );
        return;
      }

      const tokenResult = await secureGetStorage(KeychainService.REFRESH_TOKEN);
      if (!tokenResult.success || !tokenResult.data) {
        dispatch(
          setNotificationMessage({
            messageType: 'error',
            notificationMessage: t('error-biometric-session'),
          }),
        );
        return;
      }

      const res = await dispatch(
        validateRefreshToken({ t, token: tokenResult.data.password }),
      ).unwrap();
      if (res?.success) {
        // await checkAndOfferBiometric();
        navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
      }
    } catch (error) {
      dispatch(
        setNotificationMessage({
          messageType: 'error',
          notificationMessage: t('error-biometric-session'),
        }),
      );
    } finally {
      setBiometricButtonDisabled(false);
    }
  };

  const biometricButtonTitle =
    biometricType === Keychain.BIOMETRY_TYPE.FACE_ID
      ? t('with-face-id')
      : t('with-touch-id');

  return (
    <BGGradient
      colorInit={'#7646c9'}
      colorEnd={colors.dark}
      angle={160}
      angleCenter={{ x: 0.7, y: 0.9 }}>
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{t('welcome-title')} </Text>
          <Text style={styles.subTitle}>{t('welcome-subtitle')}</Text>
          <Separator border={false} height={60} />
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.subTitle}>{t('login-message')}</Text>
        </View>
        <View style={styles.buttonBox}>
          {isEnabled && (
            <ButtonWithIcon
              accessibilityLabel={t('accessibility-biometric-login')}
              disabled={biometricButtonDisabled}
              buttonStyles={{ backgroundColor: colors.light }}
              title={biometricButtonTitle}
              Icon={
                biometricType === Keychain.BIOMETRY_TYPE.FACE_ID
                  ? FaceIdIcon
                  : TouchIdIcon
              }
              iconProps={{
                width: SCREEN.widthFixed * 20,
                height: SCREEN.heightFixed * 20,
              }}
              onPress={handleBiometricLogin}
            />
          )}
          <ButtonWithIcon
            accessibilityLabel={t('accessibility-email-login')}
            buttonStyles={{ backgroundColor: colors.light }}
            title={t('with-email')}
            Icon={MailIcon}
            iconProps={{
              width: SCREEN.widthFixed * 20,
              height: SCREEN.heightFixed * 20,
            }}
            onPress={() => navigation.navigate('LoginScreen')}
          />
          <ButtonWithIcon
            accessibilityLabel={t('accessibility-google-login')}
            disabled={googleButtonDisabled}
            buttonStyles={{ backgroundColor: colors.light }}
            title={t('with-google')}
            Icon={GoogleIcon}
            iconProps={{
              width: SCREEN.widthFixed * 20,
              height: SCREEN.heightFixed * 20,
            }}
            onPress={handleGoogleOriginalSignin}
          />
          <ButtonWithIcon
            accessibilityLabel={t('accessibility-github-login')}
            disabled={githubButtonDisabled}
            buttonStyles={{ backgroundColor: colors.light }}
            title={t('with-github')}
            Icon={GithubIcon}
            iconProps={{ width: SCREEN.widthFixed * 20, height: 20 }}
            onPress={handleGitHubLogin}
          />
          {Platform.OS === 'ios' && (
            <ButtonWithIcon
              accessibilityLabel={t('accessibility-apple-login')}
              disabled={appleButtonDisabled}
              buttonStyles={{ backgroundColor: colors.light }}
              title={t('with-apple')}
              Icon={AppleIcon}
              iconProps={{ width: SCREEN.widthFixed * 20, height: 20 }}
              onPress={handleAppleLogin}
            />
          )}
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.subTitle}>{t('or')}</Text>
        </View>
        <View style={styles.buttonBox}>
          <Button
            accessibilityLabel={t('accessibility-register-login')}
            buttonStyles={{ backgroundColor: colors.light }}
            title={t('register-email')}
            onPress={() =>
              navigation.navigate('CheckEmailScreen', {
                checkMode: 'new_password',
              })
            }
          />
        </View>
      </View>
      <ModalSheet
        modalIsVisible={showBiometricModal}
        toggleSheet={setShowBiometricModal}>
        <BiometricOptInModal
          biometricType={biometryType}
          onEnable={handleBiometricEnable}
          onDecline={handleBiometricDecline}
        />
      </ModalSheet>
    </BGGradient>
  );
};

export default WelcomeScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleBox: {
      width: SCREEN.width90,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      ...textVar.titleBold,
      color: colors.light,
      textAlign: 'center',
    },
    subTitle: {
      ...textVar.base,
      color: colors.light,
      textAlign: 'center',
    },
    buttonBox: {
      width: SCREEN.width75,
      paddingVertical: 12,
      marginVertical: 8,
      gap: 18,
    },
  });
