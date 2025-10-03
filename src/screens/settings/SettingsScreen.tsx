/* Core libs & third parties libs */
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
/* Custom components */
import Separator from '@components/shared/Separator';
import ListCard from '@components/shared/ListCard';
import ModeSwitchButton from '@components/shared/ModeSwitchButton';
import MailContactBox from '@components/shared/MailContactBox';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import useThemeStorage from '@hooks/useThemeStorage';
import { logoutUser, useAppDispatch, useAppSelector } from 'src/store/authHook';
/* Types */
import { TColors } from '@constants/types';
import { SettingsStackScreenProps } from 'src/navigation/types';
/* Utilities & constants */
import { SCREEN } from '@constants/sizes';
import { setNotificationMessage, userAuth } from 'src/store/authSlice';
import { useMode } from '@context/ModeContext';
import { textVar } from '@constants/textVar';
/* Assets */
import {
  CheckIcon,
  CircleFullIcon,
  PowerIcon,
  ProfileIcon,
} from '@assets/svg/icons';

const SettingsScreen = ({
  route,
  navigation,
}: SettingsStackScreenProps<'SettingsScreen'>) => {
  const { user } = useAppSelector(userAuth);
  const { theme } = useThemeStorage();
  const { setColorTheme } = useMode();
  const { colors, styles } = useStyles(createStyles);
  const dispatch = useAppDispatch();

  const handleLogut = async () => {
    try {
      const res = await dispatch(logoutUser({ email: user?.email })).unwrap();
      if (res?.success) {
        navigation.navigate('AuthNavigator', { screen: 'WelcomeScreen' });
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> HomeScreen.tsx:26 -> handleLogut -> error :', error);
    }
  };

  const handleModeSwitch = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titlebox}>
        <Text style={styles.titleText}>Settings</Text>
      </View>
      <Separator border={false} height={24} />
      <View
        style={[
          styles.listBox,
          { paddingBottom: Platform.OS === 'ios' ? 60 : 80 },
        ]}>
        <ScrollView style={styles.listScroll}>
          <ListCard
            title={'Log out'}
            onPress={handleLogut}
            icon={<PowerIcon width={24} height={24} color={colors.text} />}
          />
          <Separator height={40} />
          <ListCard
            title={'Profile'}
            onPress={() => navigation.navigate('ProfileScreen')}
            icon={<ProfileIcon width={24} height={24} color={colors.text} />}
          />
          <ListCard
            title="Another item"
            onPress={() =>
              dispatch(
                setNotificationMessage({
                  messageType: 'information',
                  notificationMessage: 'Re direct to another screen!',
                }),
              )
            }
            icon={<CheckIcon width={20} height={20} color={colors.text} />}
          />
          <Separator height={40} />
          <Pressable onPress={handleModeSwitch} style={styles.modeBox}>
            <ModeSwitchButton onPress={handleModeSwitch} />
            <Text style={styles.modeText}>Mode switch</Text>
          </Pressable>
          <ListCard
            title="Luxury theme"
            onPress={() => setColorTheme('luxury')}
            icon={<CircleFullIcon width={14} height={14} color={'#7646c9'} />}
            checkBox={theme === 'luxury' ? true : false}
          />
          <ListCard
            title="Calm theme"
            onPress={() => setColorTheme('calm')}
            icon={<CircleFullIcon width={14} height={14} color={'#41737c'} />}
            checkBox={theme === 'calm' ? true : false}
          />
          <ListCard
            title="Gold theme"
            onPress={() => setColorTheme('gold')}
            icon={<CircleFullIcon width={14} height={14} color={'#FFC337'} />}
            checkBox={theme === 'gold' ? true : false}
          />
          <ListCard
            title="Passion theme"
            onPress={() => setColorTheme('passion')}
            icon={<CircleFullIcon width={14} height={14} color={'#CD6D94'} />}
            checkBox={theme === 'passion' ? true : false}
          />
        </ScrollView>
        <MailContactBox title="authorization.demo.app@gmail.com" />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    titlebox: {
      width: SCREEN.width90,
      height: SCREEN.heightFixed * 46,
      justifyContent: 'center',
    },
    titleText: {
      ...textVar.xlargeBold,
      color: colors.text,
    },
    listBox: {
      flex: 1,
    },
    listScroll: {
      width: SCREEN.width90,
      height: SCREEN.heightFixed * 200,
      // gap: 8,
    },
    modeBox: {
      flexDirection: 'row',
      height: SCREEN.heightFixed * 46,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 8,
    },
    modeText: {
      ...textVar.base,
      color: colors.text,
    },
  });
