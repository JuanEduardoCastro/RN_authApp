import * as Keychain from 'react-native-keychain';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, validateToken } from 'src/store/authHook';
import { CustomJwtPayload, UseCheckTokenReturn } from './types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const useCheckToken = (): UseCheckTokenReturn => {
  const [tokenSaved, setTokenSaved] = useState<boolean>(false);
  const [checkCompleted, setCheckCompleted] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const resetAutoLogin = async () => {
    __DEV__ && console.log('ENTRO AL RESET USER');
    setTokenSaved(false);
    setIsExpired(true);
    await Keychain.resetGenericPassword({ service: 'secret token' });
    await Keychain.resetGenericPassword({ service: 'secret remember me' });
  };

  useEffect(() => {
    const checkLocalStorage = async () => {
      try {
        const isGoogleSignin = await GoogleSignin.hasPreviousSignIn();
        const rememberMeFlag = await Keychain.getGenericPassword({
          service: 'secret remember me',
        });
        const rememberToken =
          rememberMeFlag && JSON.parse(rememberMeFlag.password);
        if (isGoogleSignin || rememberToken) {
          const refreshToken = await Keychain.getGenericPassword({
            service: 'secret token',
          });
          if (refreshToken) {
            setTokenSaved(true);
            const decodedToken = jwtDecode<CustomJwtPayload>(
              refreshToken.password,
            );
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.exp !== undefined) {
              if (currentTime <= decodedToken.exp) {
                dispatch(validateToken(refreshToken.password));
                isGoogleSignin && (await GoogleSignin.signInSilently());
                setTokenSaved(true);
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
            'XX -> useCheckToken.tsx:54 -> checkLocalStorage -> error :',
            error,
          );
        resetAutoLogin();
      } finally {
        __DEV__ && console.log('finalizo');
        setCheckCompleted(true);
      }
    };
    checkLocalStorage();
  }, []);

  return { tokenSaved, isExpired, checkCompleted };
};
