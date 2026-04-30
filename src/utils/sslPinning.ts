import { initializeSslPinning } from 'react-native-ssl-public-key-pinning';

import { API_BACKUP_KEY_SSL, API_PUBLIC_KEY_SSL } from '@env';

export const initializePinning = async () => {
  await initializeSslPinning({
    'api.authdemoapp-jec.com': {
      includeSubdomains: true,
      publicKeyHashes: [API_PUBLIC_KEY_SSL, API_BACKUP_KEY_SSL],
    },
  });
};
