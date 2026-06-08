import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { NotificationBadge } from './NotificationBadge';
import { COLORS, SIZES } from '@/constants';

interface NotificationTabIconProps {
  onPress: () => void;
  color?: string;
  size?: number;
}

export const NotificationTabIcon: React.FC<NotificationTabIconProps> = ({
  onPress,
  color = COLORS.text || '#000',
  size = 24,
}) => {
  const { unreadCount } = useNotificationCenter();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      <View style={styles.iconWrapper}>
        <Text style={[styles.icon, { color, fontSize: size }]}>🔔</Text>
        <NotificationBadge count={unreadCount} size="small" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: '600',
  },
});
