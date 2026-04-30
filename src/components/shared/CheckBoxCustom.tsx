import React from 'react';

import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Control, useController } from 'react-hook-form';
import CheckBox from '@react-native-community/checkbox';

import useStyles from '@hooks/useStyles';

import { SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

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
  const { field } = useController({ name, control, rules });
  const { colors, styles } = useStyles(createStyles);

  return (
    <>
      {/* eslint-disable react-native/no-inline-styles */}
      <Pressable
        style={{ alignSelf: 'flex-start' }}
        onPress={() => field.onChange(!field.value)}>
        <View style={styles.container}>
          <CheckBox
            style={[
              {
                height: SCREEN.heightFixed * 24,
                width: SCREEN.widthFixed * 24,
              },
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
            onValueChange={field.onChange}
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
      {/* eslint-enable react-native/no-inline-styles */}
    </>
  );
};

export default CheckBoxCustom;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      width: SCREEN.width100,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: Platform.OS === 'ios' ? 8 : 14,
    },
    textRemember: {
      ...textVar.medium,
      color: colors.text,
    },
  });
