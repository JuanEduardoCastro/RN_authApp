import { getApp } from '@react-native-firebase/app';
import { getMessaging } from '@react-native-firebase/messaging';
import api from '@store/apiService';
import DeviceInfo from 'react-native-device-info';

const firebaseApp = getApp();
const messagingInstance = getMessaging(firebaseApp);

export const registerFCMToken = async (accessToken: string) => {
  try {
    const fcmToken = await messagingInstance.getToken();
    if (fcmToken) {
      __DEV__ && console.log('FCM Token got it.');
    }

    const deviceId = await DeviceInfo.getUniqueId();
    const deviceName = await DeviceInfo.getDeviceName();
    const osVersion = await DeviceInfo.getSystemVersion();
    const appVersion = await DeviceInfo.getVersion();

    const response = await api.post(
      '/users/device-token',
      {
        fcmToken,
        deviceId,
        deviceName,
        osVersion,
        appVersion,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (response.status === 200 || response.status === 201) {
      __DEV__ && console.log('FCM token registered successfully.');
    }
  } catch (error) {
    __DEV__ && console.log('Failed to register FCM token.');
  }
};

export const updateDeviceLastUsed = async (accessToken: string) => {
  try {
    const deviceId = await DeviceInfo.getUniqueId();
    await api.patch(
      '/users/device-token/last-used',
      { deviceId },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  } catch (error) {
    __DEV__ && console.log('Failed to update device last used.');
  }
};
