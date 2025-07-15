import { SplashScreen } from '@components/splash/SplashScreen';
import { ThemeProvider } from '@context/ThemeContext';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from 'src/navigators/AuthNavigator';
import { Provider } from 'react-redux';
import store from 'src/store/store';
import { useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';
import Loader from '@components/shared/loader/Loader';
import RootNavigator from 'src/navigators/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCheckToken } from '@hooks/useCheckToken';

const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const linking = {
  prefixes: ['authapp://app'],
  consfig: {
    screens: {
      AuthNavigator: {
        screens: {
          NewPasswordScreen: 'new-password/:token',
        },
      },
    },
  },
};

function App() {
  const { loader, user, isAuthorized } = useAppSelector(userAuth);
  const [isAppReady, setIsAppReady] = useState(false);

  const handleAppIsReady = () => {
    setIsAppReady(true);
  };

  // console.log('EN EL APP userId -->', userId);
  // console.log('EN EL APP isExpired -->', isExpired);

  return (
    <SplashScreen handleAppIsReady={handleAppIsReady} isAppReady={isAppReady}>
      <SafeAreaProvider>
        <ThemeProvider>
          {loader && <Loader />}
          <NavigationContainer linking={linking}>
            <RootNavigator />
            {/* <AuthNavigator /> */}
            {/* <WelcomeScreen /> */}
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </SplashScreen>
  );
}

const styles = StyleSheet.create({});

export default AppWrapper;
function auth(state: unknown): unknown {
  throw new Error('Function not implemented.');
}
