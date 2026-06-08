import notificationReducer, {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  updatePreferences,
} from '@/redux/notifications/notificationSlice';
import type { PushNotification } from '@/types/notifications';

describe('notificationSlice', () => {
  const mockNotification: PushNotification = {
    id: '1',
    userId: 'user1',
    type: 'order_status',
    title: 'Order Update',
    body: 'Your order has been shipped',
    read: false,
    createdAt: Date.now(),
  };

  const initialState = {
    items: [],
    unreadCount: 0,
    preferences: {
      orderUpdates: true,
      comments: true,
      wishlist: true,
      messages: true,
      promotions: true,
    },
  };

  describe('addNotification', () => {
    it('should add a notification and increase unread count', () => {
      const state = notificationReducer(initialState, addNotification(mockNotification));
      expect(state.items).toHaveLength(1);
      expect(state.unreadCount).toBe(1);
      expect(state.items[0]).toEqual(mockNotification);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read and decrease unread count', () => {
      let state = notificationReducer(initialState, addNotification(mockNotification));
      state = notificationReducer(state, markAsRead('1'));
      expect(state.items[0].read).toBe(true);
      expect(state.unreadCount).toBe(0);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', () => {
      const notification2: PushNotification = {
        ...mockNotification,
        id: '2',
      };

      let state = notificationReducer(initialState, addNotification(mockNotification));
      state = notificationReducer(state, addNotification(notification2));
      state = notificationReducer(state, markAllAsRead());

      expect(state.items.every((n) => n.read)).toBe(true);
      expect(state.unreadCount).toBe(0);
    });
  });

  describe('removeNotification', () => {
    it('should remove a notification', () => {
      let state = notificationReducer(initialState, addNotification(mockNotification));
      state = notificationReducer(state, removeNotification('1'));
      expect(state.items).toHaveLength(0);
    });
  });

  describe('clearAllNotifications', () => {
    it('should clear all notifications', () => {
      let state = notificationReducer(initialState, addNotification(mockNotification));
      state = notificationReducer(state, clearAllNotifications());
      expect(state.items).toHaveLength(0);
      expect(state.unreadCount).toBe(0);
    });
  });

  describe('updatePreferences', () => {
    it('should update notification preferences', () => {
      const state = notificationReducer(
        initialState,
        updatePreferences({ promotions: false })
      );
      expect(state.preferences.promotions).toBe(false);
      expect(state.preferences.orderUpdates).toBe(true);
    });
  });
});
