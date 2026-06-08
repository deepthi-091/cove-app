import { useCallback } from 'react';
import { router } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';

export const useNotificationCenter = () => {
  const { items: notifications, unreadCount, preferences } = useAppSelector(
    (state) => state.notifications
  );

  const openNotificationCenter = useCallback(() => {
    router.push('/notifications' as any);
  }, []);

  const openNotificationPreferences = useCallback(() => {
    router.push('/notification-preferences' as any);
  }, []);

  return {
    notifications,
    unreadCount,
    preferences,
    openNotificationCenter,
    openNotificationPreferences,
  };
};
