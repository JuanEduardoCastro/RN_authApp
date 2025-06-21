import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
// import { SCREEN } from '@constants/sizes';
import { COLOR } from '@constants/colors';
import CheckBox from '@react-native-community/checkbox';
import { Control, useController } from 'react-hook-form';
import useStyles from '@hooks/useStyles';
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
  const { field, fieldState } = useController({ name, control, rules });
  const { colors, styles } = useStyles(createStlyes);

  return (
    <Pressable style={{ alignSelf: 'flex-start' }}>
      <View style={styles.container}>
        <CheckBox
          style={[
            { height: 24, width: 24 },
            Platform.OS === 'android'
              ? {
                  transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
                }
              : {
                  transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                },
          ]}
          disabled={disabled}
          value={field.value}
          onValueChange={val => field.onChange(val)}
          boxType="square"
          // tintColor={COLOR.primary}
          // onCheckColor={COLOR.white}
          // onFillColor={COLOR.primary}
          // onTintColor={COLOR.primary}
          // tintColors={{
          //   true: COLOR.primary,
          //   false: COLOR.primary,
          // }}
          // width={24}
          // height={24}
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
      width: '100%',
      // width: SCREEN.width,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      // paddingLeft: Platform.OS === 'ios' ? SCREEN.width * 8 : 0,
      // gap: SCREEN.width * 8,
    },
    textRemember: {
      // fontFamily: URBANIST.REGULAR,
      fontSize: 14,
      // color: COLOR.grey,
    },
  });
