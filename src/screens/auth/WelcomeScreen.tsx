/* Core libs & third parties libs */
import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
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
import { GoogleIcon, MailIcon } from '@assets/svg/icons';
import { useTranslation } from 'react-i18next';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  offlineAccess: false,
  scopes: ['profile', 'email'],
});

const WelcomeScreen = ({
  navigation,
}: AuthStackScreenProps<'WelcomeScreen'>) => {
  useBackHandler();
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [googleButtonDisabled, setGoogleButtonDisabled] = useState(false);

  const handleGoogleOriginalSignin = async () => {
    setGoogleButtonDisabled(true);
    try {
      const playServicesAvailable = await GoogleSignin.hasPlayServices();
      if (!playServicesAvailable) {
        await GoogleSignin.signOut();
        setGoogleButtonDisabled(false);
        throw Error;
      }
      const googleResponse = await GoogleSignin.signIn();
      if (!googleResponse) {
        await GoogleSignin.signOut();
        setGoogleButtonDisabled(false);
        throw Error;
      }
      const { idToken } = await GoogleSignin.getTokens();

      const data = { idToken, t };
      const res = await dispatch(googleLogin(data)).unwrap();

      if (res?.success) {
        navigation.navigate('HomeNavigator', { screen: 'HomeScreen' });
      }
      setGoogleButtonDisabled(false);
    } catch (error) {
      setGoogleButtonDisabled(false);
      __DEV__ &&
        console.log(
          'XX -> WelcomeScreen.tsx:64 -> handleGoogleOriginalSignin -> error :',
          error,
        );
    }
  };

  //TODO implement GitHub login and Aple login

  // const handleGitHubLogin = async () => {
  //   const clientID = process.env.GITHUB_CLIENT_ID;
  //   const redirectURI = process.env.GITHUB_REDIRECT_URI;
  //   const URL = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`;
  //   const supported = await Linking.canOpenURL(URL);
  //   if (supported) {
  //     await Linking.openURL(URL);
  //   }
  //   // const redirectResponse = await axios.get(
  //   //   `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}`,
  //   // );
  // };

  return (
    <BGGradient
      colorInit={'#7646c9'}
      colorEnd={colors.dark}
      angle={160}
      angleCenter={{ x: 0.7, y: 0.9 }}>
      <View style={styles.container}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{t('welcome-title')} </Text>
          <Text style={styles.subTitle}>{t('welcome-subtitle')}</Text>
          <Separator border={false} height={60} />
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.subTitle}>{t('login-message')}</Text>
        </View>
        <View style={styles.buttonBox}>
          <ButtonWithIcon
            buttonStyles={{ backgroundColor: colors.light }}
            title={t('with-email')}
            Icon={MailIcon}
            iconProps={{
              width: SCREEN.widthFixed * 20,
              height: SCREEN.heightFixed * 20,
            }}
            onPress={() => navigation.navigate('LoginScreen')}
          />
          <ButtonWithIcon
            disabled={googleButtonDisabled}
            buttonStyles={{ backgroundColor: colors.light }}
            title={t('with-google')}
            Icon={GoogleIcon}
            iconProps={{
              width: SCREEN.widthFixed * 20,
              height: SCREEN.heightFixed * 20,
            }}
            onPress={handleGoogleOriginalSignin}
            // onPress={handleGoogleLogin}
          />
          {/* <ButtonWithIcon
             title={t('with-github')}
            Icon={GithubIcon}
            iconProps={{ width: SCREEN.widthFixed * 20, height: 20 }}
            onPress={handleGitHubLogin}
          /> */}
          {/* {Platform.OS === 'ios' && (
            <ButtonWithIcon
               title={t('with-apple')}
              Icon={AppleIcon}
              iconProps={{ width: SCREEN.widthFixed * 20, height: 20 }}
              onPress={() => Alert.alert('Enter with apple account')}
            />
          )} */}
        </View>
        <View style={styles.titleBox}>
          <Text style={styles.subTitle}>{t('or')}</Text>
        </View>
        <View style={styles.buttonBox}>
          <Button
            buttonStyles={{ backgroundColor: colors.light }}
            title={t('register-email')}
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
      width: SCREEN.width90,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      ...textVar.titleBold,
      color: colors.light,
      textAlign: 'center',
    },
    subTitle: {
      ...textVar.base,
      color: colors.light,
      textAlign: 'center',
    },
    buttonBox: {
      width: SCREEN.width75,
      paddingVertical: 12,
      marginVertical: 8,
      gap: 18,
    },
  });
