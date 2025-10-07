/* Core libs & third parties libs */
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
/* Custom components */
import Separator from '@components/shared/Separator';
import ListCard from '@components/shared/ListCard';
import ModeSwitchButton from '@components/shared/ModeSwitchButton';
import MailContactBox from '@components/shared/MailContactBox';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import { logoutUser, useAppDispatch, useAppSelector } from 'src/store/authHook';
/* Types */
import { TColors } from '@constants/types';
import { SettingsStackScreenProps } from 'src/navigation/types';
/* Utilities & constants */
import { SCREEN } from '@constants/sizes';
import { setNotificationMessage, userAuth } from 'src/store/authSlice';
import { useMode } from '@context/ModeContext';
import { textVar } from '@constants/textVar';
import languagesList from '../../constants/languagesList';
/* Assets */
import {
  CheckIcon,
  CircleFullIcon,
  LanguageIcon,
  PowerIcon,
  ProfileIcon,
} from '@assets/svg/icons';
import { DataAPI } from '@store/types';
import BottomSheet from '@components/shared/bottomSheet/BottomSheet';
import { useSharedValue } from 'react-native-reanimated';
import { resources } from 'src/locale/i18next';
import ModalSheetButton from '@components/shared/bottomSheet/ModalSheetButton';
import { set } from 'react-hook-form';
import LanguagePicker from '@components/shared/locale/LanguagePicker';
import CustomModal from '@components/shared/bottomSheet/CustomModal';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'react-native-localize';

const SettingsScreen = ({
  route,
  navigation,
}: SettingsStackScreenProps<'SettingsScreen'>) => {
  const { user } = useAppSelector(userAuth);
  const { setColorTheme, themeName, toggleMode } = useMode();
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   const checkLng = async () => {
  //     const locale = getLocales();
  //     console.log('language locale -->', locale[0].languageCode);
  //     console.log('language stored -->', await AsyncStorage.getItem('lng'));
  //   };
  //   checkLng();
  // }, []);

  const toggleSheet = () => {
    setIsVisible(!isVisible);
  };

  const handleLogut = async () => {
    try {
      const res = await dispatch(
        logoutUser({ email: user?.email } as DataAPI),
      ).unwrap();
      if (res?.success) {
        navigation.navigate('AuthNavigator', { screen: 'WelcomeScreen' });
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> HomeScreen.tsx:26 -> handleLogut -> error :', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titlebox}>
        <Text style={styles.titleText}>{t('settings-title')}</Text>
      </View>
      <Separator border={false} height={24} />
      <View
        style={[
          styles.listBox,
          { paddingBottom: Platform.OS === 'ios' ? 60 : 80 },
        ]}>
        <ScrollView style={styles.listScroll}>
          <ListCard
            title={t('logout-button')}
            onPress={handleLogut}
            icon={<PowerIcon width={24} height={24} color={colors.text} />}
          />
          <Separator height={40} />
          <ListCard
            title={t('profile-button')}
            onPress={() => navigation.navigate('ProfileScreen')}
            icon={<ProfileIcon width={24} height={24} color={colors.text} />}
          />
          <ListCard
            title={t('another-item-button')}
            onPress={() =>
              dispatch(
                setNotificationMessage({
                  messageType: 'information',
                  notificationMessage: t('information-another-screen'),
                }),
              )
            }
            icon={<CheckIcon width={20} height={20} color={colors.text} />}
          />
          <ListCard
            title={t('language-button')}
            onPress={() => setIsVisible(true)}
            icon={<LanguageIcon width={22} height={22} color={colors.text} />}
          />

          <Separator height={40} />
          <Pressable onPress={toggleMode} style={styles.modeBox}>
            <ModeSwitchButton />
            <Text style={styles.modeText}>{t('mode-switch-button')}</Text>
          </Pressable>
          <ListCard
            title={t('luxury-button')}
            onPress={() => setColorTheme('luxury')}
            icon={<CircleFullIcon width={14} height={14} color={'#7646c9'} />}
            checkBox={themeName === 'luxury'}
          />
          <ListCard
            title={t('calm-button')}
            onPress={() => setColorTheme('calm')}
            icon={<CircleFullIcon width={14} height={14} color={'#41737c'} />}
            checkBox={themeName === 'calm'}
          />
          <ListCard
            title={t('gold-button')}
            onPress={() => setColorTheme('gold')}
            icon={<CircleFullIcon width={14} height={14} color={'#FFC337'} />}
            checkBox={themeName === 'gold'}
          />
          <ListCard
            title={t('passion-button')}
            onPress={() => setColorTheme('passion')}
            icon={<CircleFullIcon width={14} height={14} color={'#CD6D94'} />}
            checkBox={themeName === 'passion'}
          />
        </ScrollView>
        <MailContactBox title="authorization.demo.app@gmail.com" />
      </View>
      {/* <ModalSheetButton modalIsVisible={isVisible} toggleSheet={setIsVisible}>
        <LanguagePicker toggleSheet={setIsVisible} />
      </ModalSheetButton> */}
      <CustomModal modalIsVisible={isVisible} toggleSheet={toggleSheet}>
        <LanguagePicker toggleSheet={toggleSheet} />
      </CustomModal>
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
