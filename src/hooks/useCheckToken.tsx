import * as Keychain from 'react-native-keychain';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useAppDispatch, validateToken } from 'src/store/authHook';

interface UseCheckTokenReturn {
  userId: string | null;
  isExpired: boolean;
  checkCompleted: boolean;
}

interface CustomJwtPayload extends JwtPayload {
  _id: string;
  email: string;
}

export const useCheckToken = (): UseCheckTokenReturn => {
  const [userId, setUserId] = useState<string | null>(null);
  const [checkCompleted, setCheckCompleted] = useState(false);
  const [isExpired, setIsExpired] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkLocalStorage = async () => {
      try {
        // const storagedToken = await AsyncStorage.getItem('token');
        const storagedToken = await Keychain.getGenericPassword({
          service: process.env.KEY_SERVICES,
        });
        if (storagedToken) {
          const decodedToken = jwtDecode<CustomJwtPayload>(
            storagedToken.password,
          );
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp !== undefined) {
            if (currentTime > decodedToken.exp) {
              setUserId(null);
              setIsExpired(true);
            } else if (currentTime <= decodedToken.exp) {
              dispatch(validateToken(storagedToken.password));
              setUserId(decodedToken._id);
              setIsExpired(false);
            }
          } else {
            setUserId(null);
            setIsExpired(true);
          }
        } else {
          setUserId(null);
          setIsExpired(true);
        }
      } catch (error) {
        console.log(
          'XX -> useCheckToken.tsx:54 -> checkLocalStorage -> error :',
          error,
        );
        setUserId(null);
        setIsExpired(true);
      } finally {
        setCheckCompleted(true);
      }
    };
    checkLocalStorage();
  }, []);

  return { userId, isExpired, checkCompleted };
};
