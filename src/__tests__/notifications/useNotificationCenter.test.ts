import { renderHook } from '@testing-library/react-native';
import { useNotificationCenter } from '@/hooks/useNotificationCenter';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(Provider, { store }, children);

describe('useNotificationCenter', () => {
  it('should return notification state and functions', () => {
    const { result } = renderHook(() => useNotificationCenter(), { wrapper });

    expect(result.current).toBeDefined();
    expect(result.current.notifications).toBeDefined();
    expect(result.current.unreadCount).toBeDefined();
    expect(result.current.preferences).toBeDefined();
    expect(typeof result.current.openNotificationCenter).toBe('function');
    expect(typeof result.current.openNotificationPreferences).toBe('function');
  });

  it('should have initial unread count of 0', () => {
    const { result } = renderHook(() => useNotificationCenter(), { wrapper });
    expect(result.current.unreadCount).toBe(0);
  });

  it('should have notification preferences defined', () => {
    const { result } = renderHook(() => useNotificationCenter(), { wrapper });
    expect(result.current.preferences).toHaveProperty('orderUpdates');
    expect(result.current.preferences).toHaveProperty('comments');
    expect(result.current.preferences).toHaveProperty('wishlist');
    expect(result.current.preferences).toHaveProperty('messages');
    expect(result.current.preferences).toHaveProperty('promotions');
  });
});
