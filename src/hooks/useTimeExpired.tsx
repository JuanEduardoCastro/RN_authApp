import { useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { jwtDecode } from 'jwt-decode';
import { useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';
import { CustomJwtPayload, UseTimeExpiredReturn } from './types';

const useTimeExpired = (): UseTimeExpiredReturn => {
  const { token } = useAppSelector(userAuth);
  const [accessTokenTimer, setAccessTokenTimer] = useState<number | null>(null);
  const [refreshTokenTimer, setRefreshTokenTimer] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (token) {
      const currentTime = Math.floor(Date.now() / 1000);
      const decodeAccessToken = jwtDecode<CustomJwtPayload>(token);

      if (decodeAccessToken.exp && currentTime < decodeAccessToken.exp) {
        setAccessTokenTimer(decodeAccessToken.exp - currentTime);
      } else {
        setAccessTokenTimer(0); // Token is expired or has no expiration
      }
    } else {
      setAccessTokenTimer(null);
    }
  }, [token]);

  useEffect(() => {
    const getRefreshTokenExp = async () => {
      const credentials = await Keychain.getGenericPassword({
        service: 'secret token',
      });
      if (credentials) {
        const currentTime = Math.floor(Date.now() / 1000);
        const decodedToken = jwtDecode<CustomJwtPayload>(credentials.password);
        if (decodedToken.exp && currentTime < decodedToken.exp) {
          setRefreshTokenTimer(decodedToken.exp - currentTime);
        } else {
          setRefreshTokenTimer(0);
        }
      }
    };
    getRefreshTokenExp();
  }, [token]);

  return { accessTokenTimer, refreshTokenTimer };
};

export default useTimeExpired;
