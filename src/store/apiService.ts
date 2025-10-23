import axios from 'axios';

export const HOST = 'https://rnauthappbe-production.up.railway.app';
// __DEV__
//   ? Platform.OS === 'ios'
//     ? 'http://localhost:3000'
//     : 'http://10.0.2.2:3000'
//   :

const api = axios.create({
  baseURL: HOST,
  timeout: 10000,
});

export default api;