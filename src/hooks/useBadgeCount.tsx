import { useTranslation } from 'react-i18next';

import notifee from '@notifee/react-native';

import { userAuth } from '@store/authSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUnreadCount } from '@store/thunks';

export const useBadgeCount = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { token } = useAppSelector(userAuth);

  const syncBadge = async () => {
    if (!token) return;
    try {
      const result = await dispatch(fetchUnreadCount({ t })).unwrap();
      await notifee.setBadgeCount(result.count);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      // badge sync drop silently
    }
  };

  const clearBadge = async () => {
    await notifee.setBadgeCount(0);
  };

  return { syncBadge, clearBadge };
};
