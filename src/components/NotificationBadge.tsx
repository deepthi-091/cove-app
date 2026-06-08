import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '@/constants';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  size = 'medium',
}) => {
  if (count === 0) {
    return null;
  }

  const displayCount = count > 99 ? '99+' : count.toString();

  const sizeStyles = {
    small: {
      width: 16,
      height: 16,
      borderRadius: 8,
      fontSize: 10,
      paddingHorizontal: 2,
    },
    medium: {
      width: 20,
      height: 20,
      borderRadius: 10,
      fontSize: 12,
      paddingHorizontal: 4,
    },
    large: {
      width: 28,
      height: 28,
      borderRadius: 14,
      fontSize: 14,
      paddingHorizontal: 6,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          width: currentSize.width,
          height: currentSize.height,
          borderRadius: currentSize.borderRadius,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: currentSize.fontSize,
          },
        ]}
        numberOfLines={1}
      >
        {displayCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.error || '#FF5252',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
  },
  text: {
    color: COLORS.white || '#fff',
    fontWeight: '600',
  },
});
