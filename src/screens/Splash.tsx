import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, STRINGS } from '../constants';

export const Splash: React.FC<{ navigation: any }> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>C</Text>
      </View>
      <Text style={styles.appName}>cove</Text>
      <Text style={styles.tagline}>{STRINGS.splash_tagline}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: SIZES.borderRadius.lg,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  appName: {
    fontSize: SIZES.fontSize['3xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  tagline: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
    textAlign: 'center',
    letterSpacing: 1,
  },
});
