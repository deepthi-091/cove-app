import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PushNotification } from '@/types/notifications';

interface NotificationState {
  items: PushNotification[];
  unreadCount: number;
  preferences: {
    orderUpdates: boolean;
    comments: boolean;
    wishlist: boolean;
    messages: boolean;
    promotions: boolean;
  };
}

const initialState: NotificationState = {
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

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<PushNotification>) => {
      state.items.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
    setNotifications: (state, action: PayloadAction<PushNotification[]>) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<NotificationState['preferences']>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  setNotifications,
  updatePreferences,
} = notificationSlice.actions;

export default notificationSlice.reducer;
