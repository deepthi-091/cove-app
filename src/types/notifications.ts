export type NotificationType =
  | 'order_status'
  | 'comment_reply'
  | 'wishlist_alert'
  | 'abandoned_cart'
  | 'review_request'
  | 'promotion'
  | 'message'
  | 'account_activity';

export interface PushNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: number;
  actionUrl?: string;
}

export interface DeviceToken {
  userId: string;
  deviceId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  createdAt: number;
  lastRefreshedAt: number;
}

export interface NotificationPreferences {
  userId: string;
  orderUpdates: boolean;
  comments: boolean;
  wishlist: boolean;
  messages: boolean;
  promotions: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
}
