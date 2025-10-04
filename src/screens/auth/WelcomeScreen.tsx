/* Core libs & third parties libs */
import { Linking, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
/* Custom components */
import Separator from '@components/shared/Separator';
import BGGradient from '@components/shared/BGGradient';
import Button from '@components/shared/Button';
import ButtonWithIcon from '@components/shared/ButtonWithIcon';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import useBackHandler from '@hooks/useBackHandler';
import { useAppDispatch } from 'src/store/authHook';
import { googleLogin } from 'src/store/otherAuthHooks';
/* Types */
import { TColors } from '@constants/types';
import { AuthStackScreenProps } from '@navigation/types';
/* Utilities & constants */
import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
import { IOS_CLIENT_ID, WEB_CLIENT_ID } from '@env';
/* Assets */
import { AppleIcon, GithubIcon, GoogleIcon, MailIcon } from '@assets/svg/icons';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

const WelcomeScreen = ({
  navigation,
  route,
}: AuthStackScreenProps<'WelcomeScreen'>) => {
  useBackHandler();
  const { colors, styles } = useStyles(createStyles);
  const dispatch = useAppDispatch();

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const googleResponse = await GoogleSignin.signIn();
      const idToken = googleResponse.data!.idToken;

      const res = await dispatch(googleLogin(idToken)).unwrap();

      if (res?.success) {
        navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
      }
    } catch (error) {
      __DEV__ &&
        console.log(
          'XX -> WelcomeScreen.tsx -> handleGoogleLogin -> error :',
          error,
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
      colorInit={'#6b21a8'}
      colorEnd={colors.dark}
      angle={160}
      angleCenter={{ x: 0.8, y: 1 }}>
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>WELCOME TO AUTH APP</Text>
          <Text style={styles.subTitle}>USER AUTHORIZATION DEMO</Text>
          <Separator border={false} height={60} />
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.subTitle}>Plase login to your account </Text>
          <Text style={styles.subTitle}>and try the app </Text>
        </View>
        <View style={styles.buttonBox}>
          <ButtonWithIcon
            buttonStyles={{ backgroundColor: colors.light }}
            title={'...with your email'}
            Icon={MailIcon}
            iconProps={{
              width: SCREEN.widthFixed * 20,
              height: SCREEN.heightFixed * 20,
            }}
            onPress={() => navigation.navigate('LoginScreen')}
          />
          <ButtonWithIcon
            buttonStyles={{ backgroundColor: colors.light }}
            title={'...with Google'}
            Icon={GoogleIcon}
            iconProps={{
              width: SCREEN.widthFixed * 20,
              height: SCREEN.heightFixed * 20,
            }}
            onPress={handleGoogleLogin}
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
          <Text style={styles.subTitle}>- or -</Text>
        </View>
        <View style={styles.buttonBox}>
          <Button
            buttonStyles={{ backgroundColor: colors.light }}
            title={'Register with your email'}
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      ...textVar.titleBold,
      color: colors.light,
    },
    subTitle: {
      ...textVar.large,
      color: colors.light,
    },
    buttonBox: {
      width: SCREEN.widthFixed * 320,
      paddingVertical: 12,
      marginVertical: 8,
      gap: 18,
    },
  });
