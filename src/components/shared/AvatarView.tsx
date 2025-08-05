import {
  Image,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import useStyles from '@hooks/useStyles';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import { Control, useController } from 'react-hook-form';
import ImagePicker from 'react-native-image-crop-picker';

type AvatarViewProps = {
  name: string;
  control: Control<any>;
  rules?: any;
} & PressableProps;

const AvatarView = ({ name, control, rules, ...props }: AvatarViewProps) => {
  const { field, fieldState } = useController({ name, control, rules });
  const { colors, styles } = useStyles(createStyles);
  const [avatarURL, setAvatarURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (field.value !== undefined && field.value.length > 1) {
      setAvatarURL(field.value);
    }
  }, []);

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
    }).then(image => {
      const data = `data:${image.mime};base64,${image.data}`;
      field.onChange(data);
      setAvatarURL(data);
    });
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.avatarBox}
        onPress={() => openImageCropPicker()}
        {...props}>
        <Image
          source={
            avatarURL !== undefined
              ? { uri: avatarURL }
              : require('@assets/images/default_user_profile_pic.png')
          }
          style={[styles.avatarView, !props.disabled && styles.editMode]}
        />
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
  });
