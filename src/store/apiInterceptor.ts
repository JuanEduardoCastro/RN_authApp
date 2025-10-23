import axios, { AxiosError } from 'axios';
import * as Keychain from 'react-native-keychain';
import { setCredentials, setResetCredentials } from '@store/authSlice';
import api, { HOST } from './apiService';
import { AppStore } from './store';

let isRefreshing = false;
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

export const setupInterceptors = (store: AppStore) => {
  api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;

      // Check for 401 Unauthorized and ensure it's not a retry request
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !(originalRequest as any)._retry
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return api(originalRequest);
            })
            .catch(err => Promise.reject(err));
        }

        (originalRequest as any)._retry = true;
        isRefreshing = true;

        try {
          const credentials = await Keychain.getGenericPassword({
            service: 'secret token',
          });
          if (!credentials || !credentials.password) {
            store.dispatch(setResetCredentials());
            return Promise.reject(error);
          }

          const { data } = await axios.get(`${HOST}/users/validatetoken`, {
            headers: { Authorization: `Bearer ${credentials.password}` },
          });

          const { accessToken, user } = data;
          await Keychain.setGenericPassword('refreshToken', data.refreshToken, {
            service: 'secret token',
          });

          store.dispatch(setCredentials({ token: accessToken, user }));
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          processQueue(null, accessToken);

          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);
          store.dispatch(setResetCredentials());
          await Keychain.resetGenericPassword({ service: 'secret token' });
          await Keychain.resetGenericPassword({ service: 'secret remember me' });
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
};
