import React from 'react';
import { render } from '@testing-library/react-native';
import { NotificationBadge } from '@/components/NotificationBadge';

describe('NotificationBadge', () => {
  it('should render null when count is 0', () => {
    const { queryByText } = render(<NotificationBadge count={0} />);
    expect(queryByText('0')).toBeNull();
  });

  it('should render count when greater than 0', () => {
    const { getByText } = render(<NotificationBadge count={5} />);
    expect(getByText('5')).toBeDefined();
  });

  it('should show 99+ for count greater than 99', () => {
    const { getByText } = render(<NotificationBadge count={150} />);
    expect(getByText('99+')).toBeDefined();
  });

  it('should render with different sizes', () => {
    const { getByText: getByTextSmall } = render(
      <NotificationBadge count={3} size="small" />
    );
    expect(getByTextSmall('3')).toBeDefined();

    const { getByText: getByTextMedium } = render(
      <NotificationBadge count={3} size="medium" />
    );
    expect(getByTextMedium('3')).toBeDefined();

    const { getByText: getByTextLarge } = render(
      <NotificationBadge count={3} size="large" />
    );
    expect(getByTextLarge('3')).toBeDefined();
  });
});
