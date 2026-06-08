import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { deviceTokenManager } from '@/services/notifications/deviceTokenManager';
import { notificationService } from '@/services/notifications/notificationService';
import type { PushNotification, NotificationPayload } from '@/types/notifications';

export interface NotificationContextType {
  notifications: PushNotification[];
  unreadCount: number;
  permissionGranted: boolean;
  isInitialized: boolean;
  registerNotifications: () => Promise<void>;
  unregisterNotifications: () => Promise<void>;
  sendLocalNotification: (payload: NotificationPayload) => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkPermissions = useCallback(async () => {
    try {
      const granted = await deviceTokenManager.getPermissionStatus();
      setPermissionGranted(granted);
      return granted;
    } catch (error) {
      console.error('[NotificationContext] Error checking permissions:', error);
      return false;
    }
  }, []);

  const registerNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) {
      console.warn('[NotificationContext] User not authenticated');
      return;
    }

    try {
      const granted = await deviceTokenManager.requestPermissions();
      setPermissionGranted(granted);

      if (granted) {
        await deviceTokenManager.registerDevice(user.id);
        notificationService.initialize();

        notificationService.registerHandler('notification_received', (notification: PushNotification) => {
          setNotifications((prev) => [notification, ...prev]);
          notificationService.setBadgeCountAsync(
            notifications.filter((n) => !n.read).length + 1
          );
        });

        setIsInitialized(true);
        console.log('[NotificationContext] Notifications registered');
      }
    } catch (error) {
      console.error('[NotificationContext] Error registering notifications:', error);
    }
  }, [isAuthenticated, user, notifications]);

  const unregisterNotifications = useCallback(async () => {
    if (!user) return;

    try {
      await deviceTokenManager.unregisterDevice(user.id);
      notificationService.unregisterHandler('notification_received');
      setIsInitialized(false);
      console.log('[NotificationContext] Notifications unregistered');
    } catch (error) {
      console.error('[NotificationContext] Error unregistering notifications:', error);
    }
  }, [user]);

  const sendLocalNotification = useCallback(async (payload: NotificationPayload) => {
    try {
      await notificationService.sendLocalNotification(payload);
    } catch (error) {
      console.error('[NotificationContext] Error sending local notification:', error);
      throw error;
    }
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
      await notificationService.setBadgeCountAsync(0);
    } catch (error) {
      console.error('[NotificationContext] Error clearing notifications:', error);
    }
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  useEffect(() => {
    if (isAuthenticated && user && !isInitialized) {
      registerNotifications();
    }

    return () => {
      if (!isAuthenticated && isInitialized) {
        unregisterNotifications();
      }
    };
  }, [isAuthenticated, user, isInitialized, registerNotifications, unregisterNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    permissionGranted,
    isInitialized,
    registerNotifications,
    unregisterNotifications,
    sendLocalNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
