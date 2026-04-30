import React from 'react';

import { Image, PressableProps, StyleSheet, View } from 'react-native';

import { useAppSelector } from '@store/hooks';

import useStyles from '@hooks/useStyles';

import { SCREEN } from '@constants/dimensions';
import { TColors } from '@constants/types';

import { userAuth } from 'src/store/authSlice';

type AvatarViewProps = {
  name?: string;
} & PressableProps;

const AvatarView = ({ name: _name, ...props }: AvatarViewProps) => {
  const { user } = useAppSelector(userAuth);

  const { styles } = useStyles(createStyles);

  return (
    <View style={styles.container}>
      <View
        accessibilityLabel="Change profile picture"
        accessibilityRole="button"
        style={styles.avatarBox}
        onPress={() => {}}
        {...props}>
        <Image
          source={
            user !== null
              ? { uri: user.avatarURL }
              : require('@assets/images/default_user_profile_pic.png')
          }
          style={[styles.avatarView, !props.disabled && styles.editMode]}
        />
      </View>
    </View>
  );
};

export default AvatarView;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {},
    avatarBox: {},
    avatarView: {
      width: SCREEN.widthFixed * 80,
      height: SCREEN.heightFixed * 80,
      borderRadius: 140,
      borderWidth: 2,
      borderColor: colors.darkGray,
    },
    editMode: {
      borderWidth: 2,
      borderColor: colors.second,
    },
    iconBox: {
      position: 'absolute',
      right: -5,
      bottom: 0,
    },
  });
