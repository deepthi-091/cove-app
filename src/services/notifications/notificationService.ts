import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import type { NotificationPayload, PushNotification } from '@/types/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  private static instance: NotificationService;
  private notificationHandlers: Map<string, (notification: PushNotification) => void> = new Map();

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  initialize(): void {
    try {
      this.setupNotificationListeners();
      console.log('[NotificationService] Initialized');
    } catch (error) {
      console.error('[NotificationService] Initialization error:', error);
    }
  }

  private setupNotificationListeners(): void {
    Notifications.addNotificationReceivedListener((notification) => {
      this.handleNotificationReceived(notification);
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      this.handleNotificationResponse(response);
    });
  }

  private handleNotificationReceived(
    notification: Notifications.Notification
  ): void {
    try {
      const data = notification.request.content.data;
      console.log('[NotificationService] Notification received:', data);

      const pushNotification: PushNotification = {
        id: notification.request.identifier,
        userId: data.userId as string,
        type: data.type,
        title: notification.request.content.title || 'Notification',
        body: notification.request.content.body || '',
        data: data.payload,
        read: false,
        createdAt: Date.now(),
        actionUrl: data.actionUrl,
      };

      this.notifyHandlers('notification_received', pushNotification);
    } catch (error) {
      console.error('[NotificationService] Error handling received notification:', error);
    }
  }

  private handleNotificationResponse(
    response: Notifications.NotificationResponse
  ): void {
    try {
      const data = response.notification.request.content.data;
      const actionUrl = data.actionUrl as string;

      if (actionUrl) {
        router.push(actionUrl as any);
      }

      console.log('[NotificationService] Notification response handled');
    } catch (error) {
      console.error('[NotificationService] Error handling notification response:', error);
    }
  }

  async sendLocalNotification(payload: NotificationPayload): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
          badge: 1,
        },
        trigger: null,
      });

      console.log('[NotificationService] Local notification sent:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('[NotificationService] Error sending local notification:', error);
      throw error;
    }
  }

  async scheduleNotification(
    payload: NotificationPayload,
    delayMs: number
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data || {},
        },
        trigger: {
          seconds: delayMs / 1000,
        },
      });

      console.log('[NotificationService] Notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('[NotificationService] Error scheduling notification:', error);
      throw error;
    }
  }

  async setBadgeCountAsync(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('[NotificationService] Error setting badge count:', error);
    }
  }

  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('[NotificationService] Error clearing notifications:', error);
    }
  }

  registerHandler(handlerName: string, handler: (notification: PushNotification) => void): void {
    this.notificationHandlers.set(handlerName, handler);
  }

  unregisterHandler(handlerName: string): void {
    this.notificationHandlers.delete(handlerName);
  }

  private notifyHandlers(event: string, notification: PushNotification): void {
    this.notificationHandlers.forEach((handler) => {
      try {
        handler(notification);
      } catch (error) {
        console.error(`[NotificationService] Handler error for ${event}:`, error);
      }
    });
  }
}

export const notificationService = NotificationService.getInstance();
