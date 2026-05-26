import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
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
        </Stack>
      </AuthProvider>
    </Provider>
  );
}
