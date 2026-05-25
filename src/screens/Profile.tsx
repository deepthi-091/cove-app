import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, SIZES, STRINGS } from '../constants';

interface ProfileItem {
  id: string;
  icon: string;
  label: string;
  value?: string;
}

const PROFILE_ITEMS: ProfileItem[] = [
  { id: '1', icon: '📦', label: STRINGS.profile_my_orders, value: '5 active, 12 past' },
  { id: '2', icon: '❤️', label: STRINGS.profile_wishlist, value: '8 saved items' },
  { id: '3', icon: '📍', label: STRINGS.profile_addresses, value: '2 saved' },
  { id: '4', icon: '💳', label: STRINGS.profile_payment_methods, value: '•••• 4421 - default' },
  { id: '5', icon: '⚠️', label: STRINGS.profile_report_damage },
  { id: '6', icon: '↩️', label: STRINGS.profile_returns },
  { id: '7', icon: '🔔', label: STRINGS.profile_notifications },
];

export const Profile: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>HM</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Hannah Mercer</Text>
            <Text style={styles.userEmail}>hannah.mercer@gmail.com</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>👑 COVE MEMBER</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Purchases</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {PROFILE_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                if (item.id === '5') {
                  navigation.navigate('ReportDamage');
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>{STRINGS.profile_sign_out}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userCard: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.lg,
  },
  avatarText: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
    marginVertical: SIZES.xs,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: SIZES.sm,
  },
  badgeText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: '600',
    color: COLORS.white,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.xl,
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
    marginTop: SIZES.xs,
  },
  menuContainer: {
    paddingHorizontal: SIZES.screenPadding,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: SIZES.lg,
  },
  menuLabel: {
    fontSize: SIZES.fontSize.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
    marginRight: SIZES.md,
  },
  arrow: {
    fontSize: SIZES.fontSize.lg,
    color: COLORS.lightText,
  },
  signOutButton: {
    marginHorizontal: SIZES.screenPadding,
    marginVertical: SIZES.xl,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadius.md,
  },
  signOutText: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
