import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import { Control, useController } from 'react-hook-form';
import { TColors } from '@constants/types';
import { SCREEN } from '@constants/sizes';
import useStyles from '@hooks/useStyles';

type CheckBoxCustomProps = {
  name: string;
  control: Control<any>;
  label?: string;
  rules?: any;
  disabled?: boolean;
};

const CheckBoxCustom = ({
  name,
  control,
  label,
  rules,
  disabled,
}: CheckBoxCustomProps) => {
  const { field, fieldState } = useController({ name, control, rules });
  const { colors, styles } = useStyles(createStlyes);

  return (
    <Pressable style={{ alignSelf: 'flex-start' }}>
      <View style={styles.container}>
        <CheckBox
          style={[
            { height: SCREEN.heightFixed * 24, width: SCREEN.widthFixed * 24 },
            Platform.OS === 'android'
              ? {
                  transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                }
              : {
                  transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                },
          ]}
          disabled={disabled}
          value={field.value}
          onValueChange={val => field.onChange(val)}
          boxType="square"
          tintColor={colors.base}
          onCheckColor={colors.light}
          onFillColor={colors.base}
          onTintColor={colors.base}
          tintColors={{
            true: colors.base,
            false: colors.base,
          }}
        />
        <Text style={styles.textRemember}>{label} </Text>
      </View>
    </Pressable>
  );
};

export default CheckBoxCustom;

const createStlyes = (colors: TColors) =>
  StyleSheet.create({
    container: {
      width: SCREEN.width100,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 8,
    },
    textRemember: {
      color: colors.text,
      fontSize: 14,
    },
  });
