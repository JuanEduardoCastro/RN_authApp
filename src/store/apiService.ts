import axios from 'axios';
import { Platform } from 'react-native';

export const HOST = __DEV__
  ? Platform.OS === 'ios'
    ? 'http://localhost:8080'
    : 'http://10.0.2.2:8080'
  : 'https://api.authdemoapp-jec.com';

const api = axios.create({
  baseURL: HOST,
  timeout: 30000,
});

export default api;
