import axios from 'axios';
import { Platform } from 'react-native';

export const HOST = __DEV__
  ? Platform.OS === 'ios'
    ? 'http://localhost:8080'
    : 'http://10.0.2.2:8080'
  : 'https://api.authdemoapp-jec.com';

const enforceHTTPS = () => {
  if (!__DEV__) {
    if (HOST.startsWith('http://')) {
      const errorMessage =
        `🚨 SECURITY ERROR: Production API must use HTTPS! 🚨 Current HOST: ${HOST}. This is a CRITICAL security vulnerability.`.trim();

      __DEV__ && console.log(errorMessage);

      throw new Error('HTTPS_ENFORCEMENT_FAILED: Production must use HTTPS');
    }

    if (!HOST.startsWith('https://')) {
      const errorMessage =
        `🚨 SECURITY WARNING: Invalid production API URL 🚨 Current HOST: ${HOST}. Production API URL must start with "https://"`.trim();

      __DEV__ && console.log(errorMessage);
      throw new Error('INVALID_PRODUCTION_URL: Must start with https://');
    }
  }

  if (__DEV__) {
    console.log('✅ HTTPS enforcement passed:', HOST);
  }
};

enforceHTTPS();

const TIMEOUT = 10000;

const api = axios.create({
  baseURL: HOST,
  timeout: TIMEOUT,
});

export default api;
