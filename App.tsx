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
  const { loader } = useAppSelector(userAuth);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
    }, 900);
  }, []);

  return (
    <SplashScreen isAppReady={isAppReady} checkLocalStorage={false}>
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
