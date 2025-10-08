import * as Keychain from 'react-native-keychain';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, validateRefreshToken } from 'src/store/authHook';
import { CustomJwtPayload, UseCheckTokenReturn } from './types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import { DataAPI } from '@store/types';
import { useTranslation } from 'react-i18next';

export const useCheckToken = (): UseCheckTokenReturn => {
  const { t } = useTranslation();
  const [refreshTokenSaved, setRefreshTokenSaved] = useState<boolean>(false);
  const [checkCompleted, setCheckCompleted] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const resetAutoLogin = async () => {
    __DEV__ &&
      console.log(Platform.OS === 'ios' ? 'iOS' : 'Android', 'RESET USER');
    setRefreshTokenSaved(false);
    setIsExpired(true);
    await Keychain.resetGenericPassword({ service: 'secret token' });
    await Keychain.resetGenericPassword({ service: 'secret remember me' });
    await GoogleSignin.signOut();
  };

  useEffect(() => {
    // resetAutoLogin();
    const checkLocalStorage = async () => {
      try {
        const rememberMeFlag = await Keychain.getGenericPassword({
          service: 'secret remember me',
        });
        if (!rememberMeFlag || rememberMeFlag.password !== 'true') {
          resetAutoLogin();
          return;
        }

        const refreshToken = await Keychain.getGenericPassword({
          service: 'secret token',
        });
        if (!refreshToken) {
          resetAutoLogin();
          return;
        }

        setRefreshTokenSaved(true);
        const decodedToken = jwtDecode<CustomJwtPayload>(refreshToken.password);
        const currentTime = Math.floor(Date.now() / 1000);

        if (!decodedToken.exp || currentTime > decodedToken.exp) {
          setIsExpired(true);
          resetAutoLogin();
          return;
        }

        await dispatch(
          validateRefreshToken({ t, token: refreshToken.password } as DataAPI),
        ).unwrap();

        if (GoogleSignin.hasPreviousSignIn()) {
          await GoogleSignin.signInSilently();
        }
        setIsExpired(false);
      } catch (error) {
        __DEV__ &&
          console.log(
            'XX -> useCheckToken.tsx:67 -> checkLocalStorage -> error :',
            error,
          );
        resetAutoLogin();
      } finally {
        __DEV__ &&
          console.log(Platform.OS === 'ios' ? 'iOS' : 'Android', 'Finalizo');
        setCheckCompleted(true);
      }
    };
    checkLocalStorage();
  }, []);

  return { refreshTokenSaved, isExpired, checkCompleted };
};
