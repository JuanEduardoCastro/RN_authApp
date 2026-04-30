import { useEffect, useState } from 'react';

import { Platform } from 'react-native';

import { useTranslation } from 'react-i18next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { jwtDecode } from 'jwt-decode';

import { setNotificationMessage } from '@store/authSlice';
import { useAppDispatch } from '@store/hooks';
import { validateRefreshToken } from '@store/thunks';

import {
  authenticateWithBiometrics,
  disableBiometricLogin,
  isBiometricLoginEnabled,
} from '@utils/biometricAuth';
import {
  KeychainService,
  secureDelete,
  secureGetStorage,
} from '@utils/secureStorage';

import { CustomJwtPayload, UseCheckTokenReturn } from './types';

export const useCheckToken = (): UseCheckTokenReturn => {
  const { t } = useTranslation();
  const [refreshTokenSaved, setRefreshTokenSaved] = useState<boolean>(false);
  const [checkCompleted, setCheckCompleted] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // resetAutoLogin(); // This is in case of hard reset
    const checkLocalStorage = async () => {
      let finalRefreshTokenSaved = false;
      let finalIsExpired = true;

      const resetAutoLogin = async () => {
        try {
          await secureDelete(KeychainService.REFRESH_TOKEN);
          await secureDelete(KeychainService.REMEMBER_ME);
          if (GoogleSignin.hasPreviousSignIn()) {
            await GoogleSignin.signOut();
          }
        } catch (error) {
          __DEV__ &&
            console.log(
              'XX -> useCheckToken.tsx:36 -> resetAutoLogin -> Error during auto-login reset: :',
              error,
            );
        }
      };

      try {
        const biometricEnabled = await isBiometricLoginEnabled();

        if (biometricEnabled) {
          const authenticated = await authenticateWithBiometrics(
            t('biometric-prompt-title'),
            t('biometric-cancel'),
          );

          if (authenticated) {
            const refreshToken = await secureGetStorage(
              KeychainService.REFRESH_TOKEN,
            );

            if (refreshToken.success && refreshToken.data) {
              const decoded = jwtDecode<CustomJwtPayload>(
                refreshToken.data.password,
              );
              const currentTime = Math.floor(Date.now() / 1000);

              if (decoded.exp && currentTime < decoded.exp) {
                await dispatch(
                  validateRefreshToken({
                    t,
                    token: refreshToken.data!.password,
                  }),
                ).unwrap();

                if (GoogleSignin.hasPreviousSignIn()) {
                  await GoogleSignin.signInSilently();
                }

                finalRefreshTokenSaved = true;
                finalIsExpired = false;
                return;
              }
            }
            await disableBiometricLogin();
            dispatch(
              setNotificationMessage({
                messageType: 'warning',
                notificationMessage: t('biometrics-warning-session-expired'),
              }),
            );
          }
          return;
        }

        /* ------- */
        const rememberMeFlag = await secureGetStorage(
          KeychainService.REMEMBER_ME,
        );

        if (
          !rememberMeFlag ||
          !rememberMeFlag.data ||
          rememberMeFlag.data?.password !== 'true'
        ) {
          await resetAutoLogin();
          return;
        }

        const refreshToken = await secureGetStorage(
          KeychainService.REFRESH_TOKEN,
        );

        if (!refreshToken.success || !refreshToken.data) {
          await resetAutoLogin();
          return;
        }

        const decodedToken = jwtDecode<CustomJwtPayload>(
          refreshToken.data.password,
        );
        const currentTime = Math.floor(Date.now() / 1000);

        if (!decodedToken.exp || currentTime > decodedToken.exp) {
          await resetAutoLogin();
          return;
        }

        await dispatch(
          validateRefreshToken({
            t,
            token: refreshToken.data.password,
          }),
        ).unwrap();

        if (GoogleSignin.hasPreviousSignIn()) {
          await GoogleSignin.signInSilently();
        }

        finalRefreshTokenSaved = true;
        finalIsExpired = false;
      } catch (error) {
        __DEV__ &&
          console.log(
            'XX -> useCheckToken.tsx:67 -> checkLocalStorage -> error :',
            error,
          );
        await resetAutoLogin();
      } finally {
        __DEV__ &&
          console.log(
            Platform.OS === 'ios' ? 'iOS' : 'Android',
            'setup ended.',
          );
        setRefreshTokenSaved(finalRefreshTokenSaved);
        setIsExpired(finalIsExpired);
        setCheckCompleted(true);
      }
    };
    checkLocalStorage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return { refreshTokenSaved, isExpired, checkCompleted };
};
