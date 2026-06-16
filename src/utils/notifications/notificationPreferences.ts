import DeviceInfo from 'react-native-device-info';

import api from '@store/apiService';

import {
  KeychainService,
  secureGetStorage,
  secureSetStorage,
} from '@utils/secureStorage';

import { registerFCMToken } from './registerFCMToken';

export const getNotificationsEnabled = async (): Promise<boolean> => {
  const result = await secureGetStorage(KeychainService.NOTIFICATIONS_ENABLED);
  if (!result.success || !result.data) return true;
  return result.data.password === 'true';
};

export const enableNotifications = async (
  accessToken: string,
): Promise<void> => {
  await secureSetStorage(
    'notifications',
    'true',
    KeychainService.NOTIFICATIONS_ENABLED,
  );
  await registerFCMToken(accessToken);
};

export const disableNotifications = async (
  accessToken: string,
): Promise<void> => {
  await secureSetStorage(
    'notifications',
    'false',
    KeychainService.NOTIFICATIONS_ENABLED,
  );
  const deviceId = await DeviceInfo.getUniqueId();
  await api.delete(`/users/device-token/${deviceId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
