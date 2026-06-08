import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/context/NotificationContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
} from '@/redux/notifications/notificationSlice';
import { COLORS, SIZES } from '@/constants';
import type { PushNotification } from '@/types/notifications';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead: contextMarkAsRead, deleteNotification } = useNotifications();
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread'>('all');
  const { width } = useWindowDimensions();

  const filteredNotifications =
    selectedTab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const handleMarkAsRead = (notificationId: string) => {
    contextMarkAsRead(notificationId);
    dispatch(markAsRead(notificationId));
  };

  const handleDelete = (notificationId: string) => {
    deleteNotification(notificationId);
    dispatch(removeNotification(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearAll = async () => {
    dispatch(clearAllNotifications());
  };

  const getNotificationIcon = (type: PushNotification['type']): string => {
    switch (type) {
      case 'order_status':
        return '📦';
      case 'comment_reply':
        return '💬';
      case 'wishlist_alert':
        return '❤️';
      case 'abandoned_cart':
        return '🛒';
      case 'review_request':
        return '⭐';
      case 'promotion':
        return '🎉';
      case 'message':
        return '💌';
      case 'account_activity':
        return '🔐';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: PushNotification['type']): string => {
    switch (type) {
      case 'order_status':
        return '#4CAF50';
      case 'comment_reply':
        return '#2196F3';
      case 'wishlist_alert':
        return '#FF9800';
      case 'abandoned_cart':
        return '#F44336';
      case 'promotion':
        return '#9C27B0';
      default:
        return COLORS.primary || '#2196F3';
    }
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const renderNotificationItem = ({ item }: { item: PushNotification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification,
        { borderLeftColor: getNotificationColor(item.type) },
      ]}
      onPress={() => {
        if (!item.read) {
          handleMarkAsRead(item.id);
        }
        if (item.actionUrl) {
          router.push(item.actionUrl as any);
        }
      }}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getNotificationIcon(item.type)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>

      {!item.read && <View style={styles.unreadDot} />}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Text style={styles.deleteIcon}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📭</Text>
      <Text style={styles.emptyTitle}>
        {selectedTab === 'unread' ? 'All caught up!' : 'No notifications yet'}
      </Text>
      <Text style={styles.emptyMessage}>
        {selectedTab === 'unread'
          ? 'You have no unread notifications'
          : 'Your notifications will appear here'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {notifications.length > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              style={styles.headerAction}
            >
              <Text style={styles.headerActionText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'unread' && styles.activeTab]}
          onPress={() => setSelectedTab('unread')}
        >
          <Text style={[styles.tabText, selectedTab === 'unread' && styles.activeTabText]}>
            Unread
            {notifications.filter((n) => !n.read).length > 0 && (
              <Text style={styles.unreadBadge}>
                {' '}
                {notifications.filter((n) => !n.read).length}
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>

      {filteredNotifications.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}

      {notifications.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
          >
            <Text style={styles.clearButtonText}>Clear all notifications</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white || '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || '#e0e0e0',
  },
  backButton: {
    fontSize: 24,
    color: COLORS.text || '#000',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text || '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerAction: {
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
  },
  headerActionText: {
    color: COLORS.primary || '#2196F3',
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white || '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary || '#2196F3',
  },
  tabText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
    color: COLORS.textSecondary || '#666',
  },
  activeTabText: {
    color: COLORS.primary || '#2196F3',
  },
  unreadBadge: {
    color: COLORS.primary || '#2196F3',
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: SIZES.sm,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white || '#fff',
    marginVertical: SIZES.xs,
    marginHorizontal: SIZES.sm,
    borderRadius: SIZES.md,
    borderLeftWidth: 4,
  },
  unreadNotification: {
    backgroundColor: COLORS.primaryLight || '#f0f8ff',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.lightGray || '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text || '#000',
    marginBottom: SIZES.xs,
  },
  body: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.textSecondary || '#666',
    marginBottom: SIZES.xs,
  },
  time: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.textTertiary || '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary || '#2196F3',
    marginHorizontal: SIZES.sm,
  },
  deleteButton: {
    padding: SIZES.sm,
  },
  deleteIcon: {
    fontSize: 18,
    color: COLORS.error || '#FF5252',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.lg,
  },
  emptyTitle: {
    fontSize: SIZES.fontSize.md,
    fontWeight: '600',
    color: COLORS.text || '#000',
    marginBottom: SIZES.sm,
  },
  emptyMessage: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.textSecondary || '#666',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border || '#e0e0e0',
    backgroundColor: COLORS.white || '#fff',
  },
  clearButton: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    backgroundColor: COLORS.error || '#FF5252',
    borderRadius: SIZES.md,
    alignItems: 'center',
  },
  clearButtonText: {
    color: COLORS.white || '#fff',
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
  },
});
