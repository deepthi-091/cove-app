import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updatePreferences } from '@/redux/notifications/notificationSlice';
import { COLORS, SIZES } from '@/constants';

interface PreferenceItem {
  key: keyof any;
  label: string;
  description: string;
  icon: string;
}

const PREFERENCE_ITEMS: PreferenceItem[] = [
  {
    key: 'orderUpdates',
    label: 'Order Updates',
    description: 'Shipping, delivery, and order status changes',
    icon: '📦',
  },
  {
    key: 'comments',
    label: 'Comments & Replies',
    description: 'When someone replies to your reviews',
    icon: '💬',
  },
  {
    key: 'wishlist',
    label: 'Wishlist Alerts',
    description: 'Price drops and back in stock items',
    icon: '❤️',
  },
  {
    key: 'messages',
    label: 'Messages',
    description: 'Direct messages and chats',
    icon: '💌',
  },
  {
    key: 'promotions',
    label: 'Promotions',
    description: 'Sales, discounts, and exclusive offers',
    icon: '🎉',
  },
];

interface NotificationPreferencesProps {
  onClose?: () => void;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.notifications.preferences);
  const [localPreferences, setLocalPreferences] = useState(preferences);

  const handleToggle = (key: string) => {
    const updated = {
      ...localPreferences,
      [key]: !localPreferences[key],
    };
    setLocalPreferences(updated);
    dispatch(updatePreferences(updated));
  };

  const handleSave = () => {
    dispatch(updatePreferences(localPreferences));
    onClose?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionDescription}>
            Choose which notifications you'd like to receive
          </Text>
        </View>

        {PREFERENCE_ITEMS.map((item) => (
          <View key={item.key} style={styles.preferenceItem}>
            <View style={styles.preferenceContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <View style={styles.textContent}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
            <Switch
              value={localPreferences[item.key]}
              onValueChange={() => handleToggle(item.key)}
              trackColor={{
                false: COLORS.lightGray || '#e0e0e0',
                true: COLORS.primaryLight || '#4CAF50',
              }}
              thumbColor={
                localPreferences[item.key]
                  ? COLORS.primary || '#2196F3'
                  : COLORS.gray || '#f1f1f1'
              }
            />
          </View>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            We'll never send you unwanted notifications. You can adjust these preferences
            anytime.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  headerTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text || '#000',
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.text || '#000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingVertical: SIZES.md,
  },
  section: {
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  sectionDescription: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.textSecondary || '#666',
    fontWeight: '500',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white || '#fff',
    marginVertical: SIZES.xs,
    marginHorizontal: SIZES.sm,
    borderRadius: SIZES.md,
  },
  preferenceContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray || '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.md,
  },
  icon: {
    fontSize: 20,
  },
  textContent: {
    flex: 1,
  },
  label: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text || '#000',
    marginBottom: SIZES.xs,
  },
  description: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.textSecondary || '#666',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    marginTop: SIZES.lg,
    backgroundColor: COLORS.primaryLight || '#f0f8ff',
    marginHorizontal: SIZES.sm,
    borderRadius: SIZES.md,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: SIZES.md,
    marginTop: SIZES.xs,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.fontSize.xs,
    color: COLORS.primary || '#2196F3',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border || '#e0e0e0',
    backgroundColor: COLORS.white || '#fff',
  },
  saveButton: {
    backgroundColor: COLORS.primary || '#2196F3',
    paddingVertical: SIZES.md,
    borderRadius: SIZES.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white || '#fff',
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
  },
});
