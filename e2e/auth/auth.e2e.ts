/// <reference path="../detox.d.ts" />
/**
 * E2E Test: Authentication Flow
 * Tests login and signup workflows
 */

describe('Authentication E2E', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: { notifications: 'YES' },
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Login Flow', () => {
    it('should login with valid credentials', async () => {
      // Step 1: Wait for login screen
      await waitFor(element(by.text('Login'))).toBeVisible().withTimeout(5000);

      // Step 2: Find and fill email input
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('emailInput')).tapReturnKey();

      // Step 3: Find and fill password input
      await element(by.id('passwordInput')).typeText('password');
      await element(by.id('passwordInput')).tapReturnKey();

      // Step 4: Tap login button
      await element(by.id('loginButton')).multiTap(1);

      // Step 5: Wait for home screen to load
      await waitFor(element(by.id('homeScreen')))
        .toBeVisible()
        .withTimeout(10000);

      // Verify user is logged in by checking for user name
      await expect(element(by.text('hannah'))).toBeVisible();
    });

    it('should show error for invalid password', async () => {
      // Try to login with wrong password
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('passwordInput')).typeText('wrongpassword');
      await element(by.id('loginButton')).multiTap(1);

      // Should see error message
      await waitFor(
        element(by.text('Invalid email or password'))
      )
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate to signup screen', async () => {
      // Look for signup link
      await element(by.id('signupLink')).multiTap(1);

      // Should see signup screen
      await waitFor(element(by.text('Sign Up')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Logout Flow', () => {
    it('should logout successfully', async () => {
      // Login first
      await element(by.id('emailInput')).typeText('hannah@example.com');
      await element(by.id('passwordInput')).typeText('password');
      await element(by.id('loginButton')).multiTap(1);

      // Wait for home screen
      await waitFor(element(by.id('homeScreen')))
        .toBeVisible()
        .withTimeout(10000);

      // Navigate to profile
      await element(by.id('profileTab')).multiTap(1);

      // Find and tap logout button
      await element(by.id('logoutButton')).multiTap(1);

      // Should see confirmation dialog
      await waitFor(element(by.text('Are you sure?')))
        .toBeVisible()
        .withTimeout(3000);

      // Confirm logout
      await element(by.text('Yes, Logout')).multiTap(1);

      // Should be back at login screen
      await waitFor(element(by.text('Login')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });
});
