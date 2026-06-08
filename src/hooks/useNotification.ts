import { useCallback } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import type { NotificationPayload } from '@/types/notifications';

export const useNotification = () => {
  const notifications = useNotifications();

  const showOrderUpdate = useCallback(
    async (orderNumber: string, status: string) => {
      await notifications.sendLocalNotification({
        type: 'order_status',
        title: `Order #${orderNumber}`,
        body: `Your order is ${status}`,
        data: {
          orderNumber,
          status,
        },
      });
    },
    [notifications]
  );

  const showCommentReply = useCallback(
    async (productName: string, reviewer: string) => {
      await notifications.sendLocalNotification({
        type: 'comment_reply',
        title: 'New Reply',
        body: `${reviewer} replied to your review on ${productName}`,
        data: {
          productName,
          reviewer,
        },
      });
    },
    [notifications]
  );

  const showWishlistAlert = useCallback(
    async (productName: string, priceChange: string) => {
      await notifications.sendLocalNotification({
        type: 'wishlist_alert',
        title: 'Wishlist Update',
        body: `${productName} is now ${priceChange}`,
        data: {
          productName,
          priceChange,
        },
      });
    },
    [notifications]
  );

  const showAbandonedCart = useCallback(
    async (itemCount: number) => {
      await notifications.sendLocalNotification({
        type: 'abandoned_cart',
        title: "Don't forget your cart!",
        body: `You have ${itemCount} item${itemCount !== 1 ? 's' : ''} waiting`,
        data: {
          itemCount,
        },
      });
    },
    [notifications]
  );

  const showReviewRequest = useCallback(
    async (productName: string) => {
      await notifications.sendLocalNotification({
        type: 'review_request',
        title: 'Share Your Experience',
        body: `How did you like ${productName}?`,
        data: {
          productName,
        },
      });
    },
    [notifications]
  );

  return {
    ...notifications,
    showOrderUpdate,
    showCommentReply,
    showWishlistAlert,
    showAbandonedCart,
    showReviewRequest,
  };
};
