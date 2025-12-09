import {
  requestPermission,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  getToken,
  AuthorizationStatus,
  getMessaging,
  setBackgroundMessageHandler,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

import { getApp } from '@react-native-firebase/app';
import { registerFCMToken } from './registerFCMToken';
import { KeychainService, secureGetStorage } from '@utils/secureStorage';

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
const firebaseApp = getApp();
const messagingInstance = getMessaging(firebaseApp);

setBackgroundMessageHandler(messagingInstance, async remoteMessage => {
  __DEV__ &&
    console.log(
      'XX -> pushNotificationService.ts:22 -> remoteMessage :',
      'FCM Message received in background/quit state (iOS/Android):',
      remoteMessage,
    );
});

export const requestPermissionForNotification = async () => {
  /* Request permission */
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      __DEV__ &&
        console.log(
          'XX -> pushNotificationService.ts:38 -> requestPermissionForNotification -> Notification permission denied (Android).',
        );
      return;
    }
  } else if (Platform.OS === 'ios') {
    const authStatus = await requestPermission(messagingInstance);
    if (
      authStatus !== AuthorizationStatus.AUTHORIZED &&
      authStatus !== AuthorizationStatus.PROVISIONAL
    ) {
      __DEV__ &&
        console.log(
          'XX -> pushNotificationService.ts:50 -> requestPermissionForNotification -> Notification permission denied (iOS).',
        );
      return;
    }
  }

  /* Retrieve token */
  if (Platform.OS === 'ios') {
    await getTokenWithRetry();
  } else {
    try {
      const token = await getToken(messagingInstance);

      if (token) {
        __DEV__ &&
          console.log(
            'XX -> pushNotificationService.ts:64 -> requestPermissionForNotification -> token :',
            `✅ ${Platform.OS} FCM Device Token:`,
          );
        // 🔥 ACTION: Send this unique token to your backend/server for sending targeted messages.0
        // Example: sendTokenToServer(token);
      }
    } catch (error) {
      __DEV__ &&
        console.log(
          'XX -> pushNotificationService.ts:70 -> requestPermissionForNotification -> error :',
          'Error fetching FCM token:',
          error,
        );
      return;
    }
  }
};

const getTokenWithRetry = async (
  maxRetries = MAX_RETRIES,
  retryDelay = RETRY_DELAY,
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const token = await getToken(messagingInstance);

      __DEV__ &&
        console.log(
          'XX -> pushNotificationService.ts:90 -> getTokenWithRetry -> token :',
          'iOS FCM Device Token (attempts: ' + attempt + '):',
        );
      return token;
    } catch (error) {
      const isApnsError = (error as Error)?.message.includes('No APNS token');

      if (isApnsError && attempt < maxRetries) {
        __DEV__ &&
          console.log(
            'XX -> pushNotificationService.ts:98 -> getTokenWithRetry -> error :',
            `APNS token not ready, retrying in ${retryDelay}ms (attempt ${attempt}/${maxRetries})...`,
          );
        await new Promise((resolve: any) => setTimeout(resolve, retryDelay));
      } else {
        if (isApnsError) {
          console.warn(
            '⚠️ Could not get FCM token - APNS not available (simulator or missing configuration)',
          );
        } else {
          console.error('Error fetching FCM token:', error);
        }
      }
    }
  }
};

export const setupMessageListener = () => {
  /* Foreground message listener */
  const unsubscribeOnMessage = onMessage(
    messagingInstance,
    async remoteMessage => {
      __DEV__ &&
        console.log('Foreground Message Received (Android):', remoteMessage);
      Alert.alert(
        'New Message',
        `Title: ${remoteMessage.notification?.title}\nBody: ${remoteMessage.notification?.body}`,
      );
    },
  );

  /* Notification tap when app is in background */
  onNotificationOpenedApp(messagingInstance, remoteMessage => {
    __DEV__ &&
      console.log(
        'Notification caused app to open from background (iOS/Android):',
        remoteMessage,
      );
    // Handle deep linking or screen navigation based on the message data
  });

  /* Notification tap when the app is close or terminated */
  getInitialNotification(messagingInstance).then(remoteMessage => {
    if (remoteMessage) {
      __DEV__ &&
        console.log(
          'Notification caused app to open from quit state (iOS/Android):',
          remoteMessage,
        );
      // Handle navigation/deep link immediately after launch
    }
  });

  return unsubscribeOnMessage;
};

export const setupTokenRefreshListener = () => {
  return onTokenRefresh(messagingInstance, async newToken => {
    __DEV__ && console.log('FCT token refreshed! ');
    // get accessToken from redux
    // You'll need to pass this from App.tsx where you have Redux access
    // Or store it in local storage
    newToken;

    try {
      const credentials = await secureGetStorage(KeychainService.REFRESH_TOKEN);

      if (credentials.data) {
        const credentialT = credentials.data.password;
        await registerFCMToken(credentialT);
      }
    } catch (error) {
      __DEV__ && console.log('Failed to update refreshed token.');
    }
  });
};
