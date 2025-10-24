import axios from 'axios';
import { Platform } from 'react-native';

export const HOST = __DEV__
  ? Platform.OS === 'ios'
    ? 'http://localhost:3000'
    : 'http://10.0.2.2:3000'
  : 'https://rnauthappbe-production.up.railway.app';

const api = axios.create({
  baseURL: HOST,
  timeout: 10000,
});

export default api;
