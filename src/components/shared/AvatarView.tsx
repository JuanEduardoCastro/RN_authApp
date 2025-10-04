import {
  Image,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import { Control, useController } from 'react-hook-form';
import ImagePicker from 'react-native-image-crop-picker';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import { CameraIcon } from '@assets/svg/icons';

type AvatarViewProps = {
  name: string;
  control: Control<any>;
  rules?: any;
} & PressableProps;

const AvatarView = ({ name, control, rules, ...props }: AvatarViewProps) => {
  const { field, fieldState } = useController({ name, control, rules });
  const { colors, styles } = useStyles(createStyles);

  const openImageCropPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.6,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 400,
      includeBase64: true,
      cropperCircleOverlay: true,
      avoidEmptySpaceAroundImage: true,
      freeStyleCropEnabled: true,
    })
      .then(image => {
        const data = `data:${image.mime};base64,${image.data}`;
        field.onChange(data);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          console.error('ImagePicker Error: ', error);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Change profile picture"
        accessibilityRole="button"
        style={styles.avatarBox}
        onPress={() => openImageCropPicker()}
        {...props}>
        <Image
          source={
            field.value
              ? { uri: field.value }
              : require('@assets/images/default_user_profile_pic.png')
          }
          style={[styles.avatarView, !props.disabled && styles.editMode]}
        />
        <View style={styles.iconBox}>
          {!props.disabled && (
            <CameraIcon width={22} height={22} color={colors.second} />
          )}
        </View>
      </Pressable>
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
