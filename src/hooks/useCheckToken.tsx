import * as Keychain from 'react-native-keychain';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, validateRefreshToken } from 'src/store/authHook';
import { CustomJwtPayload, UseCheckTokenReturn } from './types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

export const useCheckToken = (): UseCheckTokenReturn => {
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
    const checkLocalStorage = async () => {
      try {
        const isGoogleSignin = GoogleSignin.hasPreviousSignIn();

        const rememberMeFlag = await Keychain.getGenericPassword({
          service: 'secret remember me',
        });

        const rememberToken =
          rememberMeFlag && JSON.parse(rememberMeFlag.password);

        if (rememberToken) {
          const refreshToken = await Keychain.getGenericPassword({
            service: 'secret token',
          });
          if (refreshToken) {
            setRefreshTokenSaved(true);
            const decodedToken = jwtDecode<CustomJwtPayload>(
              refreshToken.password,
            );
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.exp !== undefined) {
              if (currentTime <= decodedToken.exp) {
                dispatch(validateRefreshToken(refreshToken.password));
                isGoogleSignin && (await GoogleSignin.signInSilently());
                setRefreshTokenSaved(true);
                setIsExpired(false);
                return;
              }
            }
          }
        }
        resetAutoLogin();
      } catch (error) {
        __DEV__ &&
          console.log(
            'XX -> useCheckToken.tsx:59 -> checkLocalStorage -> error :',
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
