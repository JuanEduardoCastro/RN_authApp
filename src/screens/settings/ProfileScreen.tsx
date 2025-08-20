/* Core libs & third parties libs */
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
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
/* Types */
import { TColors } from '@constants/types';
import { SettingsStackScreenProps } from 'src/navigators/types';
/* Utilities & constants */
import { userAuth } from 'src/store/authSlice';
import { SCREEN } from '@constants/sizes';
import { textVar } from '@constants/textVar';
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
  const [editEnable, setEditEnable] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
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
    const userData: Record<string, string> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'email') {
        userData[key] = value;
      }
    });

    const dataAPI = {
      userData: userData,
      token: token,
    };

    try {
      const res = await dispatch(editUser(dataAPI)).unwrap();
      if (!res?.success) {
        navigation.navigate('AuthNavigator', { screen: 'LoginScreen' });
      }
    } catch (error) {
      __DEV__ &&
        console.log('XX -> ProfileScreen.tsx:76 -> onSubmit -> error :', error);
    }
    setEditEnable(false);
  };

  const onLayoutHandle = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (Math.floor(height) <= SCREEN.heightFixed * 491) {
      setScrollEnabled(false);
    } else {
      setScrollEnabled(true);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderGoBack onPress={() => navigation.goBack()} />
      <View style={styles.titleBox}>
        <Text style={styles.title}>This is your profile screen</Text>
        <Separator border={false} height={12} />
        <Text style={styles.subTitle}>
          Please, complete your personal information
        </Text>
      </View>
      <Separator border={false} height={32} />
      <View style={styles.buttonBox}>
        <AvatarView name="avatarURL" control={control} disabled={!editEnable} />
        <View style={styles.editButton}>
          <Pressable
            onPress={editEnable ? handleSubmit(onSubmit) : handleEditInfo}>
            <Text style={styles.editButtonText}>
              {editEnable ? 'Save' : 'Edit'}
            </Text>
          </Pressable>
          {editEnable && (
            <Pressable onPress={handleCancelEditInfo}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          )}
        </View>
      </View>
      <Separator border={false} height={24} />
      <KeyboardScrollView
        extraScroll={Platform.OS === 'ios' ? 4 : 0}
        scrollEnabled={scrollEnabled}>
        <View style={styles.inputBox} onLayout={onLayoutHandle}>
          <InputAuthField
            editable={false}
            inputStyles={styles.textinput}
            name="email"
            label="Email"
            control={control}
          />
          <InputAuthField
            editable={editEnable}
            inputStyles={styles.textinput}
            name="firstName"
            label="First name"
            control={control}
            placeholder="Firs name"
          />
          <InputAuthField
            editable={editEnable}
            inputStyles={styles.textinput}
            name="lastName"
            label="Family name"
            control={control}
            placeholder="Family name"
          />
          <PhoneNumberPicker
            editable={editEnable}
            inputStyles={styles.textinput}
            name="phoneNumber"
            label="Phone number"
            control={control}
            placeholder="Phone number"
          />
          <InputAuthField
            editable={editEnable}
            inputStyles={styles.textinput}
            name="occupation"
            label="Occupation"
            control={control}
            placeholder="Occupation"
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
      flex: 1,
      paddingHorizontal: 16,
    },
    textinput: {
      borderColor: colors.second,
    },
  });
