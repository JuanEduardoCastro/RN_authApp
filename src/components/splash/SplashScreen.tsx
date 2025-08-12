import * as Keychain from 'react-native-keychain';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BGGradient from '@components/shared/BGGradient';
import { SCREEN } from '@constants/sizes';
import { useAppDispatch, useAppSelector } from 'src/store/authHook';
import { useCheckToken } from '@hooks/useCheckToken';
import { userAuth } from 'src/store/authSlice';

type SplashScreenProps = {
  children: ReactNode;
  isAppReady: boolean;
  handleAppIsReady: () => void;
};

type SplashProps = {
  isAppReady: boolean;
  handleAppIsReady: () => void;
};

export const SplashScreen = ({
  children,
  isAppReady,
  handleAppIsReady,
}: SplashScreenProps) => {
  return (
    <>
      {isAppReady && children}
      <Splash handleAppIsReady={handleAppIsReady} isAppReady={isAppReady} />
    </>
  );
};

const IMG_STATE = {
  LOADING_IMAGE: 'Loading image',
  FADE_IN_IMAGE: 'Fade in image',
  WAIT_FOR_APP_TO_BE_READY: 'Wait for app to be ready',
  FADE_OUT: 'Fade out',
  HIDDEN: 'Hidden',
};

export const Splash = ({ handleAppIsReady, isAppReady }: SplashProps) => {
  const { user } = useAppSelector(userAuth);
  const { refreshTokenSaved, isExpired, checkCompleted } = useCheckToken();
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const [imageState, setImageState] = useState(IMG_STATE.LOADING_IMAGE);
  const dispatch = useAppDispatch();

  const checkUserLogged = async () => {
    if (checkCompleted) {
      if (refreshTokenSaved && !isExpired) {
        if (user) {
          console.log('-----------> entro cuando se lleno el user');
          handleAppIsReady();
        }
      } else {
        console.log('-----------> entro cuando el user es null');
        handleAppIsReady();
      }
    }
  };

  useEffect(() => {
    if (imageState === IMG_STATE.FADE_IN_IMAGE) {
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1100, // FADE IN DURATION
        useNativeDriver: true,
      }).start(() => setImageState(IMG_STATE.WAIT_FOR_APP_TO_BE_READY));
    }

    checkUserLogged();
  }, [imageOpacity, imageState]);

  useEffect(() => {
    if (imageState === IMG_STATE.WAIT_FOR_APP_TO_BE_READY) {
      if (isAppReady) {
        setImageState(IMG_STATE.FADE_OUT);
      }
    }
  }, [isAppReady, imageState]);

  useEffect(() => {
    if (imageState === IMG_STATE.FADE_OUT) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 500, // FADE OUT DURATION
        delay: 2400, // MINIMUN TIME THE LOGO WILL STAY VISIBLE
        useNativeDriver: true,
      }).start(() => {
        setImageState(IMG_STATE.HIDDEN);
      });
    }
  }, [containerOpacity, imageState]);

  if (imageState === IMG_STATE.HIDDEN) return null;

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <SafeAreaProvider>
        <BGGradient>
          <Animated.Image
            style={[styles.image, { opacity: imageOpacity }]}
            resizeMode={'contain'}
            source={require('@assets/images/Frame_125_gary.png')}
            fadeDuration={0}
            onLoad={() => setImageState(IMG_STATE.FADE_IN_IMAGE)}
          />
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 0.1.0 (01)</Text>
          </View>
        </BGGradient>
      </SafeAreaProvider>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    width: SCREEN.width100,
    height: SCREEN.height100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    alignSelf: 'center',
    width: SCREEN.widthFixed * 213,
    height: SCREEN.heightFixed * 75,
  },
  versionContainer: {
    width: SCREEN.width100,
    alignItems: 'center',
    paddingBottom: 8,
  },
  versionText: {
    fontSize: 14,
    color: '#E1E2E6',
  },
});
