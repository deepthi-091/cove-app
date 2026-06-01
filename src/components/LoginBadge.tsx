import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { useAuth } from '@/context/AuthContext';

export const LoginBadge: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const getBadgeText = (): string => {
    if (!isAuthenticated) return 'G';
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handlePress = () => {
    console.log('LoginBadge pressed - isAuthenticated:', isAuthenticated);

    if (isAuthenticated) {
      // If logged in, go to profile
      console.log('User is authenticated, navigating to profile');
      router.push('/tabs/profile' as any);
    } else {
      // If not logged in, go to login
      console.log('User is not authenticated, navigating to login');
      router.push('/login' as any);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.badge}
      onPress={handlePress}
    >
      <Text style={styles.badgeText}>{getBadgeText()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  badgeText: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '700',
    color: COLORS.white,
  },
});
