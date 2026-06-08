import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { NotificationProvider, useNotifications } from '@/context/NotificationContext';
import { AuthProvider } from '@/context/AuthContext';

const TestComponent = () => {
  const { unreadCount, notifications, isInitialized } = useNotifications();
  return (
    <>
      <screen testID="unread-count">{unreadCount}</screen>
      <screen testID="initialized">{isInitialized ? 'true' : 'false'}</screen>
    </>
  );
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      <NotificationProvider>{component}</NotificationProvider>
    </AuthProvider>
  );
};

describe('NotificationContext', () => {
  describe('useNotifications hook', () => {
    it('should throw error when used outside provider', () => {
      const renderWithoutProvider = () => {
        render(<TestComponent />);
      };

      expect(renderWithoutProvider).toThrow();
    });

    it('should provide notification context', () => {
      renderWithProviders(<TestComponent />);
      expect(screen.getByTestID('unread-count')).toBeDefined();
    });

    it('should initialize with zero unread count', async () => {
      renderWithProviders(<TestComponent />);
      await waitFor(() => {
        expect(screen.getByTestID('unread-count')).toHaveTextContent('0');
      });
    });
  });
});
