import { Alert, Linking, Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { WelcomeScreenNavigationProp } from 'src/navigators/types';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import useStyles from '@hooks/useStyles';
import Separator from '@components/shared/Separator';
import BGGradient from '@components/shared/BGGradient';
import Button from '@components/shared/Button';
import ButtonWithIcon from '@components/shared/ButtonWithIcon';
import { AppleIcon, GithubIcon, GoogleIcon, MailIcon } from '@assets/svg/icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env';
import {
  googleLogin,
  useAppDispatch,
  useAppSelector,
} from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';
import { newNotificationMessage } from '@utils/newNotificationMessage';
import useBackHandler from '@hooks/useBackHandler';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

const WelcomeScreen = ({ navigation, route }: WelcomeScreenNavigationProp) => {
  useBackHandler();
  const { user } = useAppSelector(userAuth);
  const { colors, styles } = useStyles(createStyles);
  const dispatch = useAppDispatch();

  const GoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const googleUser = await GoogleSignin.signIn();
      return googleUser;
    } catch (error) {
      __DEV__ &&
        console.log(
          'XX -> WelcomeScreen.tsx:35 -> GoogleLogin -> error :',
          error,
        );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleLoginRes = await GoogleLogin();
      // console.log(
      //   'que viene en el googleLoginRes',
      //   googleLoginRes?.data?.idToken,
      // );
      const res = await dispatch(googleLogin(googleLoginRes?.data?.idToken));
      if (res?.success) {
        newNotificationMessage(dispatch, {
          messageType: 'success',
          notificationMessage: 'Welcome back!\nEnjoy this app!!',
        });
        navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
      }
    } catch (error) {
      __DEV__ &&
        console.log(
          'XX -> WelcomeScreen.tsx:45 -> handleGoogleLogin -> error :',
          error,
          navigation.popToTop(),
        );
    }
  };

  const handleGitHubLogin = async () => {
    const clientID = process.env.GITHUB_CLIENT_ID;
    const redirectURI = process.env.GITHUB_REDIRECT_URI;
    const URL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
    const supported = await Linking.canOpenURL(URL);
    if (supported) {
      await Linking.openURL(URL);
    }
    // const redirectResponse = await axios.get(
    //   `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`,
    // );
    __DEV__ && console.log('QUE PASA ACA --------------->', supported);
  };

  return (
    <BGGradient
      colorInit={colors.base}
      colorEnd={colors.dark}
      angle={160}
      angleCenter={{ x: 0.6, y: 0.9 }}>
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>WELCOME TO AUTH APP</Text>
          <Text style={styles.subTitle}>
            USER CREDENTIAL AUTHORIZATION DEMO
          </Text>
          <Separator border={false} height={60} />
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.subTitle}>Plase login to your account </Text>
          <Text style={styles.subTitle}>and try the app </Text>
        </View>
        <View style={styles.buttonBox}>
          <ButtonWithIcon
            title={'...with your email'}
            Icon={MailIcon}
            iconProps={{ width: SCREEN.widthFixed * 20, height: 20 }}
            onPress={() => navigation.navigate('LoginScreen')}
          />
          <ButtonWithIcon
            title={'...with Google'}
            Icon={GoogleIcon}
            iconProps={{ width: SCREEN.widthFixed * 20, height: 20 }}
            onPress={handleGoogleLogin}
            // onPress={() => Alert.alert('Enter with Google account')}
          />
          {/* <ButtonWithIcon
            title={'...with GitHub'}
            Icon={GithubIcon}
            iconProps={{ width: SCREEN.widthFixed * 20, height: 20 }}
            onPress={handleGitHubLogin}
          /> */}
          {/* {Platform.OS === 'ios' && (
            <ButtonWithIcon
              title={'...with apple'}
              Icon={AppleIcon}
              iconProps={{ width: SCREEN.widthFixed * 20, height: 20 }}
              onPress={() => Alert.alert('Enter with apple account')}
            />
          )} */}
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.subTitle}>or</Text>
        </View>
        <View style={styles.buttonBox}>
          <Button
            title={'Register with your email'}
            textStyles={{ fontWeight: 600 }}
            onPress={() =>
              navigation.navigate('CheckEmailScreen', {
                checkMode: 'new_password',
              })
            }
          />
        </View>
      </View>
    </BGGradient>
  );
};

export default WelcomeScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleBox: {
      // backgroundColor: "pink",
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: colors.light,
      fontWeight: 700,
      fontSize: 20,
    },
    subTitle: {
      color: colors.light,
      fontWeight: 500,
      fontSize: 18,
    },
    buttonBox: {
      width: SCREEN.widthFixed * 320,
      paddingVertical: 12,
      marginVertical: 8,
      gap: 18,
    },
  });
