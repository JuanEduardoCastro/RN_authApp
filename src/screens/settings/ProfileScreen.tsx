import React, { useState } from 'react';

import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { editUser } from '@store/thunks';
import { EditUserPayload } from '@store/types';

import AvatarViewButton from '@components/shared/AvatarViewButton';
import HeaderGoBack from '@components/shared/HeaderGoBack';
import InputAuthField from '@components/shared/InputAuthField';
import DismissKeyboardOnClick from '@components/shared/keyboard/DismissKeyboardOnClick';
import KeyboardScrollView from '@components/shared/KeyboardScrollView';
import PhoneNumberPicker from '@components/shared/phoneNumber/PhoneNumberPicker';
import Separator from '@components/shared/Separator';

import useStyles from '@hooks/useStyles';
import useUserData from '@hooks/useUserData';

import { SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

import { SettingsStackScreenProps } from 'src/navigation/types';
import { userAuth } from 'src/store/authSlice';

interface ProfileDataProps {
  firstName: string;
  email: string;
  lastName: string;
  phoneNumber: any;
  occupation: string;
  avatarURL: string | undefined;
}

const ProfileScreen = ({
  navigation,
}: SettingsStackScreenProps<'ProfileScreen'>) => {
  const { user } = useAppSelector(userAuth);
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
  const { handleSubmit, control, reset } = method;
  const { styles } = useStyles(createStyles);
  const { t } = useTranslation();
  const [editEnable, setEditEnable] = useState(false);
  const dispatch = useAppDispatch();

  const handleEditInfo = () => {
    Keyboard.dismiss();
    setEditEnable(true);
  };

  const handleCancelEditInfo = () => {
    Keyboard.dismiss();
    setCodeIndex(null);
    setEditEnable(false);
    reset();
  };

  const onSubmit = async (data: ProfileDataProps) => {
    Keyboard.dismiss();
    const { ...userData } = data;
    const dataAPI = { userData, t };

    try {
      const res = await dispatch(editUser(dataAPI as EditUserPayload)).unwrap();

      if (res?.success) {
        navigation.goBack();
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> ProfileScreen.tsx:83 -> onSubmit -> error :', error);
    }
    setEditEnable(false);
  };

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
        <AvatarViewButton
          name="avatarURL"
          control={control}
          disabled={!editEnable}
        />
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
      <KeyboardScrollView extraScroll={Platform.OS === 'ios' ? 4 : 0}>
        <DismissKeyboardOnClick>
          <View style={styles.inputBox}>
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
            <Separator
              border={false}
              height={Platform.OS === 'ios' ? 60 : 80}
            />
          </View>
        </DismissKeyboardOnClick>
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
