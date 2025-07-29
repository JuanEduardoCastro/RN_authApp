import * as Keychain from 'react-native-keychain';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, validateToken } from 'src/store/authHook';
import { CustomJwtPayload, UseCheckTokenReturn } from './types';

export const useCheckToken = (): UseCheckTokenReturn => {
  const [tokenSaved, setTokenSaved] = useState<boolean>(false);
  const [checkCompleted, setCheckCompleted] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkLocalStorage = async () => {
      try {
        // const storagedToken = await AsyncStorage.getItem('token');
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
            if (currentTime > decodedToken.exp) {
              setTokenSaved(false);
              setIsExpired(true);
              await Keychain.resetGenericPassword();
            } else if (currentTime <= decodedToken.exp) {
              dispatch(validateToken(refreshToken.password));
              setTokenSaved(true);
              setIsExpired(false);
            }
          } else {
            setTokenSaved(false);
            setIsExpired(true);
            await Keychain.resetGenericPassword();
          }
        } else {
          setTokenSaved(false);
          setIsExpired(true);
          await Keychain.resetGenericPassword();
        }
      } catch (error) {
        console.log(
          'XX -> useCheckToken.tsx:54 -> checkLocalStorage -> error :',
          error,
        );
        setTokenSaved(false);
        setIsExpired(true);
        await Keychain.resetGenericPassword();
      } finally {
        setCheckCompleted(true);
      }
    };
    checkLocalStorage();
  }, []);

  return { tokenSaved, isExpired, checkCompleted };
};
