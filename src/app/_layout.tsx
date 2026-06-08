import { useEffect } from 'react';
import { Platform, UIManager } from 'react-native';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, rehydrateCart } from '@/redux/store';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { NotificationBanner } from '@/components/NotificationBanner';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    rehydrateCart();
  }, []);
  return (
    <AuthProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppProviders>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="get-started" options={{ headerShown: false }} />
            <Stack.Screen name="tabs" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ presentation: 'fullScreenModal', headerShown: false }} />
            <Stack.Screen name="signup" options={{ presentation: 'fullScreenModal', headerShown: false }} />
            <Stack.Screen name="product/[id]" options={{ presentation: 'card', headerShown: false }} />
            <Stack.Screen name="report-damage" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="cart" options={{ headerShown: false }} />
            <Stack.Screen name="checkout" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="notification-preferences" options={{ presentation: 'modal', headerShown: false }} />
          </Stack>
          <NotificationBanner />
        </AppProviders>
      </Provider>
    </GestureHandlerRootView>
  );
}
