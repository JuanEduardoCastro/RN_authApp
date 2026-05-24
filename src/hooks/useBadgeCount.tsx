import { useTranslation } from 'react-i18next';

import notifee from '@notifee/react-native';

import { useAppDispatch } from '@store/hooks';
import { fetchUnreadCount } from '@store/thunks';

export const useBadgeCount = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const syncBadge = async () => {
    const result = await dispatch(fetchUnreadCount({ t })).unwrap();
    await notifee.setBadgeCount(result.count);
  };

  const clearBadge = async () => {
    await notifee.setBadgeCount(0);
  };

  return { syncBadge, clearBadge };
};
