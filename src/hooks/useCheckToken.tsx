import * as Keychain from 'react-native-keychain';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, validateToken } from 'src/store/authHook';
import { CustomJwtPayload, UseCheckTokenReturn } from './types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

export const useCheckToken = (): UseCheckTokenReturn => {
  const [tokenSaved, setTokenSaved] = useState<boolean>(false);
  const [checkCompleted, setCheckCompleted] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const resetAutoLogin = async () => {
    __DEV__ && console.log(Platform.OS === 'ios' ? 'iOS' : 'Android', 'ENTRO AL RESET USER');
    setTokenSaved(false);
    setIsExpired(true);
    await Keychain.resetGenericPassword({ service: 'secret token' });
    await Keychain.resetGenericPassword({ service: 'secret remember me' });
  };

  useEffect(() => {
    const checkLocalStorage = async () => {
      try {
        const isGoogleSignin = await GoogleSignin.hasPreviousSignIn();

        // console.log('XX -> useCheckToken.tsx:28 -> isGoogleSignin :', Platform.OS === 'ios' ? 'iOS' : 'Android', isGoogleSignin)

        const rememberMeFlag = await Keychain.getGenericPassword({
          service: 'secret remember me',
        });

        // console.log('XX -> useCheckToken.tsx:33 -> rememberMeFlag :', Platform.OS === 'ios' ? 'iOS' : 'Android', rememberMeFlag)

        const rememberToken =
          rememberMeFlag && JSON.parse(rememberMeFlag.password);

        if (isGoogleSignin || rememberToken) {
          // console.log("O ES GOOGLE SIGNIN O ES REMEMBER TOKEN")

          const refreshToken = await Keychain.getGenericPassword({
            service: 'secret token',
          });
          if (refreshToken) {
            // console.log("---> ENTRO CON EL REFRESH TOKEN ? ? ?")
            setTokenSaved(true);
            const decodedToken = jwtDecode<CustomJwtPayload>(
              refreshToken.password,
            );
            const currentTime = Math.floor(Date.now() / 1000);
            if (decodedToken.exp !== undefined) {
              if (currentTime <= decodedToken.exp) {
                // console.log("EL TOKEN ES VALIDO") 
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
        __DEV__ && console.log(Platform.OS === 'ios' ? 'iOS' : 'Android', 'Finalizo');
        setCheckCompleted(true);
      }
    };
    checkLocalStorage();
  }, []);

  // console.log(Platform.OS === 'ios' ? 'iOS' : 'Android', "tokenSaved :", tokenSaved, "isExpired :", isExpired, "checkCompleted :", checkCompleted)

  return { tokenSaved, isExpired, checkCompleted };
};
