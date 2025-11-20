import {
  requestPermission,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  getToken,
  AuthorizationStatus,
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

import { getApp } from '@react-native-firebase/app';

const firebaseApp = getApp();
const messagingInstance = getMessaging(firebaseApp);

setBackgroundMessageHandler(messagingInstance, async remoteMessage => {
  __DEV__ &&
    console.log(
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
      __DEV__ && console.log('Notification permission denied (Android).');
      return;
    }
  } else if (Platform.OS === 'ios') {
    const authStatus = await requestPermission(messagingInstance);
    if (
      authStatus !== AuthorizationStatus.AUTHORIZED &&
      authStatus !== AuthorizationStatus.PROVISIONAL
    ) {
      __DEV__ && console.log('Notification permission denied (iOS).');
      return;
    }
    // await messaging().registerDeviceForRemoteMessages();
  }

  /* Retrieve token */
  try {
    const token = await getToken(messagingInstance);
    __DEV__ && console.log(`✅ ${Platform.OS} FCM Device Token:`, token);
    // 🔥 ACTION: Send this unique token to your backend/server for sending targeted messages.
    // Example: sendTokenToServer(token);
  } catch (error) {
    console.error('Error fetching FCM token:', error);
    return;
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
