import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BGGradient from '@components/shared/BGGradient';

type SplashScreenProps = {
  children: ReactNode;
  isAppReady: boolean;
  checkLocalStorage: boolean;
};

type SplashProps = {
  isAppReady: boolean;
  checkLoaclStorage: boolean;
};

export const SplashScreen = ({
  children,
  isAppReady,
  checkLocalStorage,
}: SplashScreenProps) => {
  return (
    <>
      {isAppReady && children}
      <Splash isAppReady={isAppReady} checkLoaclStorage={checkLocalStorage} />
    </>
  );
};

const { width, height } = Dimensions.get('screen');

const IMG_STATE = {
  LOADING_IMAGE: 'Loading image',
  FADE_IN_IMAGE: 'Fade in image',
  WAIT_FOR_APP_TO_BE_READY: 'Wait for app to be ready',
  FADE_OUT: 'Fade out',
  HIDDEN: 'Hidden',
};

export const Splash = ({ isAppReady, checkLoaclStorage }: SplashProps) => {
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const [imageState, setImageState] = useState(IMG_STATE.LOADING_IMAGE);

  // const dispatch;

  const checkUserLogged = () => {
    console.log('CHECK FOR USER LOGGED');
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
            source={require('@assets/Frame_125_gary.png')}
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
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    alignSelf: 'center',
    width: (width / 428) * 213,
    height: (height / 926) * 75,
  },
  versionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#E1E2E6',
  },
});
