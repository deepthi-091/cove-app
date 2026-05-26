import { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/get-started' as any);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>C</Text>
        <Text style={styles.tagline}>Cove</Text>
        <Text style={styles.subtitle}>Discover. Shop. Enjoy.</Text>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.md,
  },
  tagline: {
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.fontSize.base,
    color: COLORS.lightText,
    fontStyle: 'italic',
  },
  footer: {
    paddingBottom: SIZES.xl,
  },
});
