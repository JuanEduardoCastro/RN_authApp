import { API_PUBLIC_KEY_SSL } from '@env';
import { initializeSslPinning } from 'react-native-ssl-public-key-pinning';

export const initializePinning = async () => {
  await initializeSslPinning({
    'api.authdemoapp-jec.com': {
      includeSubdomains: true,
      publicKeyHashes: [API_PUBLIC_KEY_SSL],
    },
  });
};
