import React from 'react';

import { Pressable, StyleSheet, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import AppText from '@components/shared/appsComps/AppText';
import AppTextInput from '@components/shared/appsComps/AppTextInput';
import Separator from '@components/shared/Separator';

import useStyles from '@hooks/useStyles';

import { GlassIcon } from '@assets/svg/icons';

import { moderateScale, SCREEN } from '@constants/dimensions';
import { textVar } from '@constants/textVar';
import { TColors } from '@constants/types';

type SearchBoxProps = {
  search: string;
  handleSearch: (text: string) => void;
  handleSelectAll: () => void;
  allSelected: boolean;
  selectedIds: Set<string>;
};

const SearchBox = ({
  search,
  handleSearch,
  handleSelectAll,
  allSelected,
  selectedIds,
}: SearchBoxProps) => {
  const { colors, styles } = useStyles(createStyles);
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <AppText style={styles.titleText}>{t('admin-panel-button')}</AppText>
      </View>
      <Separator border={false} height={12} />
      <View style={styles.searchRow}>
        <GlassIcon width={16} height={16} color={colors.text} />
        <AppTextInput
          style={styles.searchInput}
          value={search}
          onChangeText={handleSearch}
          placeholder={t('search-placeholder')}
          placeholderTextColor={colors.lightgray}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>
      <Separator border={false} height={12} />
      <View style={styles.selectionRow}>
        <Pressable
          onPress={handleSelectAll}
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}>
          <AppText style={styles.selectAllText}>
            {allSelected ? t('admin-deselect-all') : t('admin-select-all')}
          </AppText>
        </Pressable>
        {selectedIds.size > 0 && (
          <AppText style={styles.selectionCount}>
            {selectedIds.size} {t('selected')}
          </AppText>
        )}
      </View>
      <Separator border={false} height={4} />
    </View>
  );
};

export default SearchBox;

const createStyles = (colors: TColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: moderateScale(16),
    },
    pressed: {
      opacity: 0.7,
    },
    titleBox: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleText: {
      ...textVar.xlargeBold,
      color: colors.text,
    },
    searchRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(8),
      borderWidth: 1,
      borderColor: colors.base,
      borderRadius: 8,
      paddingHorizontal: moderateScale(12),
      height: SCREEN.heightFixed * 44,
    },
    searchInput: {
      flex: 1,
      ...textVar.base,
      color: colors.text,
    },
    selectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: moderateScale(16),
    },
    selectAllText: {
      ...textVar.base,
      color: colors.second,
    },
    selectionCount: {
      ...textVar.small,
      color: colors.textMuted,
    },
  });
