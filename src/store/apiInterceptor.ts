import axios, { AxiosError } from 'axios';
import { setCredentials, setResetCredentials } from '@store/authSlice';
import api, { HOST } from './apiService';
import { AppStore } from './store';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '@hooks/types';
import {
  KeychainService,
  secureDelete,
  secureGetStorage,
  secureSetStorage,
} from '@utils/secureStorage';
import { RetryableAxiosRequestConfig } from './types';

let refreshTokenPromise: Promise<string> | null = null;

let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const refreshAccessToken = async (store: AppStore): Promise<string> => {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = (async () => {
    try {
      const credentials = await secureGetStorage(KeychainService.REFRESH_TOKEN);
      if (!credentials.success || !credentials.data) {
        store.dispatch(setResetCredentials());
        throw new Error('No refresh token available');
      }

      const validateToken = await axios.post(
        `${HOST}/users/token/refresh`,
        {},
        {
          headers: { Authorization: `Bearer ${credentials.data.password}` },
        },
      );

      const { accessToken, user, refreshToken } = validateToken.data.data;

      const saveCredentials = await secureSetStorage(
        'refreshToken',
        refreshToken,
        KeychainService.REFRESH_TOKEN,
      );

      if (!saveCredentials.success) {
        __DEV__ && console.warn('Failed to save new refresh token');
      }

      store.dispatch(setCredentials({ token: accessToken, user }));
      processQueue(null, accessToken);
      return accessToken;
    } catch (error) {
      processQueue(error as AxiosError, null);
      store.dispatch(setResetCredentials());

      await secureDelete(KeychainService.REFRESH_TOKEN);
      await secureDelete(KeychainService.REMEMBER_ME);

      throw error;
    } finally {
      refreshTokenPromise = null;
    }
  })();
  return refreshTokenPromise;
};

export const setupInterceptors = (store: AppStore) => {
  api.interceptors.request.use(
    async config => {
      // Check for access token expire validation
      const state = store.getState();
      const token = state.auth.token;

      const skipValidation =
        config.url?.includes('/login') ||
        config.url?.includes('/validatetoken') ||
        config.url?.includes('/check-email') ||
        config.url?.includes('/reset-password');

      if (skipValidation || !token) {
        return config;
      }

      try {
        const decode = jwtDecode<CustomJwtPayload>(token);
        const now = Date.now();
        const expiresAt = (decode.exp || 0) * 1000;
        const bufferTime = 5 * 60 * 1000; // 5 minutes
        const isExpiredOrExpiresSoon = expiresAt - bufferTime < now;

        if (isExpiredOrExpiresSoon) {
          if (refreshTokenPromise) {
            const newToken = await refreshTokenPromise;
            if (config.headers) {
              config.headers.Authorization = `Bearer ${newToken}`;
            }
            return config;
          }

          const newToken = await refreshAccessToken(store);
          if (config.headers) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
          return config;
        }
        return config;
      } catch (error) {
        __DEV__ &&
          console.log(
            'XX -> apiInterceptor.ts:123 -> setupInterceptors -> Error validating token expiration: ',
            error,
          );
        return config;
      }
    },
    error => Promise.reject(error),
  );

  api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;

      // Check for 401 Unauthorized and ensure it's not a retry request
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !(originalRequest as RetryableAxiosRequestConfig)._retry
      ) {
        (originalRequest as RetryableAxiosRequestConfig)._retry = true;

        if (refreshTokenPromise) {
          try {
            const newToken = await refreshTokenPromise;
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return api(originalRequest);
          } catch (error) {
            return Promise.reject(error);
          }
        }

        try {
          const newToken = await refreshAccessToken(store);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );
};
