import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SIZES } from '@/constants';

export interface SnackbarProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  visible: boolean;
  onDismiss: () => void;
}

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type,
  duration = 3000,
  visible,
  onDismiss,
}) => {
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        dismissSnackbar();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const dismissSnackbar = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  if (!visible) {
    return null;
  }

  const backgroundColor =
    type === 'success'
      ? COLORS.success || '#4CAF50'
      : type === 'error'
      ? COLORS.error || '#FF5252'
      : COLORS.primary || '#2196F3';

  const icon =
    type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          backgroundColor,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
      <TouchableOpacity onPress={dismissSnackbar} style={styles.closeButton}>
        <Text style={styles.closeText}>✕</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
    marginRight: SIZES.md,
  },
  message: {
    flex: 1,
    color: COLORS.white,
    fontSize: SIZES.fontSize.sm,
    fontWeight: '500',
  },
  closeButton: {
    padding: SIZES.sm,
  },
  closeText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
