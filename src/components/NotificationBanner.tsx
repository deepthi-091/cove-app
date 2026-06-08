import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNotifications } from '@/context/NotificationContext';
import { COLORS, SIZES } from '@/constants';

export const NotificationBanner: React.FC = () => {
  const { notifications } = useNotifications();
  const [slideAnim] = useState(new Animated.Value(-100));
  const [visibleNotification, setVisibleNotification] = useState<typeof notifications[0] | null>(
    null
  );
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (notifications.length > 0 && !visibleNotification) {
      setVisibleNotification(notifications[0]);
      showBanner();
    }
  }, [notifications, visibleNotification]);

  const showBanner = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      hideBanner();
    }, 4000);

    return () => clearTimeout(timer);
  };

  const hideBanner = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisibleNotification(null);
    });
  };

  if (!visibleNotification) {
    return null;
  }

  const getNotificationColor = () => {
    switch (visibleNotification.type) {
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

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor: getNotificationColor(),
          width,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={hideBanner}
        activeOpacity={0.8}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {visibleNotification.title}
          </Text>
          <Text style={styles.body} numberOfLines={1}>
            {visibleNotification.body}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: SIZES.xl,
    paddingHorizontal: SIZES.lg,
    paddingBottom: SIZES.md,
    zIndex: 1000,
  },
  content: {
    flex: 1,
  },
  textContainer: {
    gap: SIZES.xs,
  },
  title: {
    color: 'white',
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
  },
  body: {
    color: 'white',
    fontSize: SIZES.fontSize.xs,
    fontWeight: '400',
    opacity: 0.9,
  },
});
