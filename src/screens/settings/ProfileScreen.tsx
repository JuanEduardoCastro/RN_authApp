/* Core libs & third parties libs */
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
/* Custom components */
import Separator from '@components/shared/Separator';
import InputAuthField from '@components/shared/InputAuthField';
import AvatarView from '@components/shared/AvatarView';
import PhoneNumberPicker from '@components/shared/phoneNumber/PhoneNumberPicker';
import KeyboardScrollView from '@components/shared/KeyboardScrollView';
import HeaderGoBack from '@components/shared/HeaderGoBack';
/* Custom hooks */
import useStyles from '@hooks/useStyles';
import { editUser, useAppDispatch, useAppSelector } from 'src/store/authHook';
import useUserData from '@hooks/useUserData';
import useWhenToScroll from '@hooks/useWhenToScroll';
/* Types */
import { TColors } from '@constants/types';
import { SettingsStackScreenProps } from 'src/navigation/types';
/* Utilities & constants */
import { userAuth } from 'src/store/authSlice';
import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
import { useTranslation } from 'react-i18next';
/* Assets */

interface ProfileDataProps {
  firstName: string;
  email: string;
  lastName: string;
  phoneNumber: any;
  occupation: string;
  avatarURL: string | undefined;
}

const tabbarHeight =
  Platform.OS === 'ios' ? SCREEN.heightFixed * 80 : SCREEN.heightFixed * 60;

const ProfileScreen = ({
  navigation,
  route,
}: SettingsStackScreenProps<'ProfileScreen'>) => {
  const { user, token } = useAppSelector(userAuth);
  const method = useForm<ProfileDataProps>({
    defaultValues: {
      firstName: user?.firstName,
      email: user?.email,
      lastName: user?.lastName,
      phoneNumber: user?.phoneNumber,
      occupation: user?.occupation,
      avatarURL: user?.avatarURL,
    },
  });
  const { setCodeIndex } = useUserData();
  const { handleSubmit, control, reset, setValue, getValues } = method;
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [editEnable, setEditEnable] = useState(false);
  const dispatch = useAppDispatch();

  const handleEditInfo = () => {
    setEditEnable(true);
  };

  const handleCancelEditInfo = () => {
    setCodeIndex(null);
    setEditEnable(false);
    reset();
  };

  const onSubmit = async (data: ProfileDataProps) => {
    const { email, ...userData } = data;
    const dataAPI = { userData, t };
    console.log('lo que esta para mandar -->', dataAPI);

    try {
      const res = await dispatch(editUser(dataAPI as any)).unwrap();
      console.log('XX -> ProfileScreen.tsx:79 -> onSubmit -> res :', res);

      if (!res?.success) {
        navigation.navigate('AuthNavigator', { screen: 'LoginScreen' });
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> ProfileScreen.tsx:83 -> onSubmit -> error :', error);
    }
    setEditEnable(false);
  };

  const scrollEnabled = useWhenToScroll(layoutHeight);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderGoBack onPress={() => navigation.goBack()} />
      <View style={styles.titleBox}>
        <Text style={styles.title}>{t('profile-title')}</Text>
        <Separator border={false} height={12} />
        <Text style={styles.subTitle}>{t('profile-subtitle')}</Text>
      </View>
      <Separator border={false} height={32} />
      <View style={styles.buttonBox}>
        <AvatarView name="avatarURL" control={control} disabled={!editEnable} />
        <View style={styles.editButton}>
          <Pressable
            onPress={editEnable ? handleSubmit(onSubmit) : handleEditInfo}>
            <Text style={styles.editButtonText}>
              {editEnable ? t('save-profile-button') : t('edit-profile-button')}
            </Text>
          </Pressable>
          {editEnable && (
            <Pressable onPress={handleCancelEditInfo}>
              <Text style={styles.cancelButtonText}>
                {t('cancel-profile-button')}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      <Separator border={false} height={24} />
      <KeyboardScrollView
        extraScroll={Platform.OS === 'ios' ? 4 : 0}
        // scrollEnabled={scrollEnabled}
      >
        <View
          style={styles.inputBox}
          onLayout={e => setLayoutHeight(e.nativeEvent.layout.height)}>
          <InputAuthField
            editable={false}
            inputStyles={styles.textinput}
            name="email"
            label={t('email-label')}
            control={control}
          />
          <InputAuthField
            editable={editEnable}
            inputStyles={styles.textinput}
            name="firstName"
            label={t('first-name-label')}
            control={control}
            placeholder={t('first-name-placeholder')}
          />
          <InputAuthField
            editable={editEnable}
            inputStyles={styles.textinput}
            name="lastName"
            label={t('last-name-label')}
            control={control}
            placeholder={t('last-name-placeholder')}
          />
          <PhoneNumberPicker
            editable={editEnable}
            inputStyles={styles.textinput}
            name="phoneNumber"
            label={t('phone-number-label')}
            control={control}
            placeholder={t('phone-number-placeholder')}
          />
          <InputAuthField
            editable={editEnable}
            inputStyles={styles.textinput}
            name="occupation"
            label={t('occupation-label')}
            control={control}
            placeholder={t('occupation-placeholder')}
          />
        </View>
        <Separator border={false} height={Platform.OS === 'ios' ? 60 : 80} />
      </KeyboardScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    titleBox: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      ...textVar.xlargeBold,
      color: colors.text,
    },
    subTitle: {
      ...textVar.large,
      color: colors.text,
    },
    buttonBox: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: 32,
    },
    editButton: {
      flexDirection: 'row',
      gap: 16,
    },
    editButtonText: {
      ...textVar.baseBold,
      color: colors.second,
    },
    cancelButtonText: {
      ...textVar.baseBold,
      color: colors.danger,
    },
    inputBox: {
      width: SCREEN.width100,
      flex: 1,
      paddingHorizontal: 16,
    },
    textinput: {
      borderColor: colors.second,
    },
  });
