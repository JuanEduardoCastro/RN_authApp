import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import Separator from '@components/shared/Separator';
import { editUser, useAppDispatch, useAppSelector } from 'src/store/authHook';
import { userAuth } from 'src/store/authSlice';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputAuthField from '@components/shared/InputAuthField';
import { useForm } from 'react-hook-form';
import { SCREEN } from '@constants/sizes';
import AvatarView from '@components/shared/AvatarView';
import PhoneNumberPicker from '@components/shared/phoneNumber/PhoneNumberPicker';
import useUserData from '@hooks/useUserData';
import { newNotificationMessage } from '@utils/newNotificationMessage';

interface ProfileDataProps {
  firstName: string;
  email: string;
  lastName: string;
  phoneNumber: any;
  occupation: string;
  avatarURL: string | undefined;
}

const ProfileScreen = () => {
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
    const fullData: Record<string, string> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'email') {
        fullData[key] = value;
      }
    });

    try {
      const res = await dispatch(editUser(fullData, token));
      if (res?.success) {
        newNotificationMessage(dispatch, {
          messageType: 'success',
          notificationMessage: 'Profile updated successfully!',
        });
      } else {
        newNotificationMessage(dispatch, {
          messageType: 'error',
          notificationMessage: 'Something went wrong.\nPlease, try again.',
        });
      }
    } catch (error) {}
    setEditEnable(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBox}>
        <Separator border={false} />
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
      <View style={styles.inputBox}>
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
      color: colors.text,
      fontWeight: 700,
      fontSize: 20,
    },
    subTitle: {
      color: colors.text,
      fontWeight: 500,
      fontSize: 18,
    },
    buttonBox: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingHorizontal: 32,
      // backgroundColor: 'green',
    },
    editButton: {
      flexDirection: 'row',
      gap: 16,
    },
    editButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.second,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.cancel,
    },
    inputBox: {
      width: SCREEN.width100,
      paddingHorizontal: 16,
    },
    textinput: {
      borderColor: colors.second,
    },
  });
