import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { COLORS, SIZES, STRINGS } from '../constants';
import { Button, Input } from '../components';

export const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('hannah@example.com');
  const [password, setPassword] = useState('••••••••••');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>C</Text>
          </View>
        </View>

        <Text style={styles.title}>{STRINGS.login_title}</Text>
        <Text style={styles.subtitle}>{STRINGS.login_subtitle}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>{STRINGS.login_email}</Text>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={styles.passwordRow}>
            <Text style={styles.label}>{STRINGS.login_password}</Text>
            <TouchableOpacity>
              <Text style={styles.forgotLink}>{STRINGS.login_forgot_password}</Text>
            </TouchableOpacity>
          </View>
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            label={STRINGS.login_button}
            onPress={() => navigation.replace('MainTabs')}
          />
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>{STRINGS.login_or_continue}</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>🍎 {STRINGS.login_apple}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>🔍 {STRINGS.login_google}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {STRINGS.login_new_user}{' '}
            <Text style={styles.createLink}>{STRINGS.login_create_account}</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xxxl,
  },
  logoIcon: {
    width: 50,
    height: 50,
    borderRadius: SIZES.borderRadius.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  title: {
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
    marginBottom: SIZES.xl,
  },
  form: {
    marginBottom: SIZES.xl,
  },
  label: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
  },
  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  forgotLink: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.xl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  orText: {
    marginHorizontal: SIZES.md,
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
    fontWeight: '600',
  },
  socialButtons: {
    gap: SIZES.md,
    marginBottom: SIZES.xl,
  },
  socialButton: {
    paddingVertical: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.md,
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
  },
  createLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
