import { useEffect, useState } from 'react';

import {
  AppState,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';

import { userAuth } from '@store/authSlice';
import { useAppSelector } from '@store/hooks';
import store, { RootState } from '@store/store';
import { fetchMessages } from '@store/thunks';

import { navigationRef } from '@navigation/navigationRef';
import RootNavigator from '@navigation/RootNavigation';
import { RootStackParamList } from '@navigation/types';

import Loader from '@components/shared/loader/Loader';
import NotificationBanner from '@components/shared/notifications/NotificationBanner';
import { SplashScreen } from '@components/splash/SplashScreen';

import { useBadgeCount } from '@hooks/useBadgeCount';
import { ModeProvider } from '@context/ModeContext';

import { getNotificationsEnabled } from '@utils/notifications/notificationPreferences';
import {
  requestPermissionForNotification,
  setupMessageListener,
  setupTokenRefreshListener,
} from '@utils/notifications/pushNotificationService';
import { initializePinning } from '@utils/sslPinning';

import i18n from 'src/locale/i18next';

(Text as any).defaultProps = (Text as any).defaultProps ?? {};
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = (TextInput as any).defaultProps ?? {};
(TextInput as any).defaultProps.allowFontScaling = false;

if (__DEV__) {
  configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });
}

initializePinning();

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'authapp://',
    'com.authdemoapp.github://',
    'https://d2wi1nboge7qqt.cloudfront.net',
    'https://app.authdemoapp-jec.com',
  ],
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => {
      __DEV__ && console.log('url received.');
      listener(url);
    };

    const subscription = Linking.addEventListener('url', onReceiveURL);

    return () => {
      subscription.remove();
    };
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) {
      __DEV__ && console.log('COLD START');
      return url;
    } else {
      __DEV__ && console.log('NO HAY URL');
      return null;
    }
  },
  config: {
    screens: {
      AuthNavigator: {
        screens: {
          NewPasswordScreen: 'app/new-password/:emailToken',
          WelcomeScreen: 'callback',
        },
      },
    },
  },
};

function App() {
  const { loader } = useAppSelector(userAuth);
  const { syncBadge } = useBadgeCount();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    let unsubscribeTokenRefresh = () => {};

    getNotificationsEnabled().then(enabled => {
      if (enabled) {
        requestPermissionForNotification();
        unsubscribe = setupMessageListener();
        unsubscribeTokenRefresh = setupTokenRefreshListener();
      }
    });

    // requestPermissionForNotification();
    // const unsubscribe = setupMessageListener();
    // const unsubscribeTokenRefresh = setupTokenRefreshListener();

    const appStateSubcription = AppState.addEventListener(
      'change',
      nextState => {
        if (nextState === 'active') {
          syncBadge();
          const { auth } = store.getState() as RootState;
          if (auth.isAuthorized) {
            store.dispatch(fetchMessages({ t: i18n.t }));
          }
        }
      },
    );

    return () => {
      unsubscribe();
      unsubscribeTokenRefresh();
      appStateSubcription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAppIsReady = () => {
    setIsAppReady(true);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <KeyboardProvider>
        <SafeAreaProvider>
          <I18nextProvider i18n={i18n}>
            <SplashScreen
              handleAppIsReady={handleAppIsReady}
              isAppReady={isAppReady}>
              <ModeProvider>
                {loader && <Loader />}
                <NotificationBanner />
                <NavigationContainer ref={navigationRef} linking={linking}>
                  <RootNavigator />
                </NavigationContainer>
              </ModeProvider>
            </SplashScreen>
          </I18nextProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default AppWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
