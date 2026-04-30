import { useEffect, useState } from 'react';

import { Linking, StyleSheet } from 'react-native';

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
import store from '@store/store';

import RootNavigator from '@navigation/RootNavigation';
import { RootStackParamList } from '@navigation/types';

import Loader from '@components/shared/loader/Loader';
import NotificationBanner from '@components/shared/notifications/NotificationBanner';
import { SplashScreen } from '@components/splash/SplashScreen';

import { ModeProvider } from '@context/ModeContext';

import {
  requestPermissionForNotification,
  setupMessageListener,
  setupTokenRefreshListener,
} from '@utils/notifications/pushNotificationService';
import { initializePinning } from '@utils/sslPinning';

import i18n from 'src/locale/i18next';

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
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    requestPermissionForNotification();
    const unsubscribe = setupMessageListener();
    const unsubscribeTokenRefresh = setupTokenRefreshListener();

    return () => {
      unsubscribe();
      unsubscribeTokenRefresh();
    };
  }, []);

  const handleAppIsReady = () => {
    setIsAppReady(true);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <I18nextProvider i18n={i18n}>
            <SplashScreen
              handleAppIsReady={handleAppIsReady}
              isAppReady={isAppReady}>
              <ModeProvider>
                {loader && <Loader />}
                <NotificationBanner />
                <NavigationContainer linking={linking}>
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
