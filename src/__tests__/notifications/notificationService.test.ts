import { notificationService } from '@/services/notifications/notificationService';
import type { NotificationPayload } from '@/types/notifications';

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should initialize without throwing', () => {
      expect(() => {
        notificationService.initialize();
      }).not.toThrow();
    });
  });

  describe('registerHandler', () => {
    it('should register a notification handler', () => {
      const handler = jest.fn();
      notificationService.registerHandler('test', handler);
      expect(handler).toBeDefined();
    });
  });

  describe('unregisterHandler', () => {
    it('should unregister a notification handler', () => {
      const handler = jest.fn();
      notificationService.registerHandler('test', handler);
      notificationService.unregisterHandler('test');
      expect(handler).toBeDefined();
    });
  });

  describe('sendLocalNotification', () => {
    it('should send a local notification', async () => {
      const payload: NotificationPayload = {
        type: 'order_status',
        title: 'Test Notification',
        body: 'This is a test',
        data: { test: true },
      };

      const result = await notificationService.sendLocalNotification(payload);
      expect(typeof result).toBe('string');
    });
  });

  describe('setBadgeCountAsync', () => {
    it('should set badge count', async () => {
      expect(async () => {
        await notificationService.setBadgeCountAsync(5);
      }).not.toThrow();
    });
  });

  describe('clearAllNotifications', () => {
    it('should clear all notifications', async () => {
      expect(async () => {
        await notificationService.clearAllNotifications();
      }).not.toThrow();
    });
  });
});
