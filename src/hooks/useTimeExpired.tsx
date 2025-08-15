import { useEffect, useState } from 'react';
import { useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';
import { CustomJwtPayload, UseTimeExpiredReturn } from './types';
import { jwtDecode } from 'jwt-decode';

const useTimeExpired = (): UseTimeExpiredReturn => {
  const { token } = useAppSelector(userAuth);
  const [accessTokenTimer, setAccessTokenTimer] = useState<any | null>(null);
  const [refreshTokenTimer, setRefreshTokenTimer] = useState<any | null>(null);

  useEffect(() => {
    if (token) {
      const currentTime = Math.floor(Date.now() / 1000);
      const decodeAccessToken = jwtDecode<CustomJwtPayload>(token);
      if (currentTime < decodeAccessToken.exp!) {
        setAccessTokenTimer(decodeAccessToken.exp! - currentTime);
      }
    }
  }, [token]);

  return { accessTokenTimer, refreshTokenTimer };
};

export default useTimeExpired;
