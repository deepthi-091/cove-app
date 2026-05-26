import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { Button } from '@/components';

export default function GetStarted() {
  const handleGetStarted = () => {
    router.replace('/login' as any);
  };

  const handleBrowseProducts = () => {
    router.replace('/tabs' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>C</Text>
          <Text style={styles.title}>Welcome to Cove</Text>
          <Text style={styles.subtitle}>Curated home & lifestyle products</Text>
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureTitle}>Premium Selection</Text>
            <Text style={styles.featureDescription}>Handpicked products for your home</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🚚</Text>
            <Text style={styles.featureTitle}>Fast Delivery</Text>
            <Text style={styles.featureDescription}>Quick and reliable shipping</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💳</Text>
            <Text style={styles.featureTitle}>Secure Payments</Text>
            <Text style={styles.featureDescription}>Safe and encrypted transactions</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Get Started" onPress={handleGetStarted} />
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBrowseProducts}>
          <Text style={styles.secondaryButtonText}>Browse as Guest</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xxxl,
  },
  logo: {
    fontSize: 60,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.fontSize.base,
    color: COLORS.lightText,
    textAlign: 'center',
  },
  features: {
    gap: SIZES.xl,
  },
  featureItem: {
    backgroundColor: COLORS.lightGray,
    padding: SIZES.lg,
    borderRadius: SIZES.borderRadius.lg,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: SIZES.md,
  },
  featureTitle: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  featureDescription: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    gap: SIZES.md,
  },
  secondaryButton: {
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.borderRadius.md,
  },
  secondaryButtonText: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
