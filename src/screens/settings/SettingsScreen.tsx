import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TColors } from '@constants/types';
import useStyles from '@hooks/useStyles';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { SCREEN } from '@constants/sizes';
import Separator from '@components/shared/Separator';
import { CheckIcon, PowerIcon, ProfileIcon } from '@assets/svg/icons';
import ListCard from '@components/shared/ListCard';
import ModeSwitchButton from '@components/shared/ModeSwitchButton';
import { SettingsStackScreenProps } from 'src/navigators/types';
import MailContactBox from '@components/shared/MailContactBox';
import { logoutUser, useAppDispatch, useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';

const SettingsScreen = ({
  route,
  navigation,
}: SettingsStackScreenProps<'SettingsScreen'>) => {
  const { user } = useAppSelector(userAuth);
  const { colors, styles } = useStyles(createStyles);
  const dispatch = useAppDispatch();
  const inset = useSafeAreaInsets();

  const handleLogut = async () => {
    try {
      const res = await dispatch(logoutUser({ email: user?.email }));
      if (res?.success) {
        navigation.navigate('AuthNavigator', { screen: 'WelcomeScreen' });
      }
      // const res = await dispatch(logoutUser({ email: user?.email }));
      // if (res?.success) {
      //   navigation.navigate('AuthNavigator', { screen: 'WelcomeScreen' });
      // }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> HomeScreen.tsx:26 -> handleLogut -> error :', error);
    }
  };

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
          <Separator borderColor={colors.darkGray} height={40} />
          <ListCard
            title={'Profile'}
            onPress={() => navigation.navigate('ProfileScreen')}
            icon={<ProfileIcon width={24} height={24} color={colors.text} />}
          />
          <ListCard
            title="Otro"
            onPress={() => console.log('hizo click')}
            icon={<CheckIcon width={20} height={20} color={colors.text} />}
          />
          <Separator borderColor={colors.darkGray} height={40} />
          <View style={styles.modeBox}>
            <ModeSwitchButton />
            <Text style={styles.modeText}>Mode switch</Text>
          </View>
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
      color: colors.text,
      fontWeight: 700,
      fontSize: 20,
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
      alignItems: 'center',
      gap: 18,
    },
    modeText: {
      color: colors.text,
      fontSize: 16,
    },
  });
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
