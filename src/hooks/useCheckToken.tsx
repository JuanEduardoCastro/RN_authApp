import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, validateRefreshToken } from 'src/store/authHook';
import { CustomJwtPayload, UseCheckTokenReturn } from './types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { DataAPI } from '@store/types';
import { useTranslation } from 'react-i18next';
import {
  KeychainService,
  secureDelete,
  secureGetStorage,
} from '@utils/secureStorage';

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
          } as DataAPI),
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
  }, [dispatch]);

  return { refreshTokenSaved, isExpired, checkCompleted };
};
