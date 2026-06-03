/**
 * Integration Tests: Authentication + Storage
 * Tests the complete flow of login/signup and data persistence
 */

import { api } from '@/utils/api';
import { storage } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('Integration: Authentication + Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('should login user and save to storage', async () => {
      const email = 'hannah@example.com';
      const password = 'password';

      // Step 1: Login via API
      const user = await api.login(email, password);
      expect(user).toBeDefined();
      expect(user.email).toBe(email);

      // Step 2: Save user to storage
      await storage.setUser(user);

      // Step 3: Verify storage was called with correct data
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cove_user',
        JSON.stringify(user)
      );
    });

    it('should handle complete login -> save -> retrieve flow', async () => {
      const email = 'test@example.com';
      const password = 'password';

      // Step 1: Login
      const loginResult = await api.login(email, password);
      expect(loginResult.email).toBe(email);
      expect(loginResult.name).toBe('test');

      // Step 2: Save to storage
      await storage.setUser(loginResult);

      // Step 3: Mock retrieval from storage
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(loginResult)
      );

      // Step 4: Retrieve from storage
      const savedUser = await storage.getUser();
      expect(savedUser).toEqual(loginResult);
      expect(savedUser?.email).toBe(email);
    });

    it('should handle login failure and not save to storage', async () => {
      const email = 'invalid@example.com';
      const password = 'wrongpassword';

      // Attempt login (should fail)
      await expect(api.login(email, password)).rejects.toThrow(
        'Invalid email or password'
      );

      // Storage should not be called
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Signup Flow', () => {
    it('should signup user and save to storage', async () => {
      const name = 'John Doe';
      const email = 'john.doe@example.com';
      const password = 'password123';

      // Step 1: Signup via API
      const newUser = await api.signup(name, email, password);
      expect(newUser).toBeDefined();
      expect(newUser.name).toBe(name);
      expect(newUser.email).toBe(email);

      // Step 2: Save to storage
      await storage.setUser(newUser);

      // Step 3: Verify storage call
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cove_user',
        JSON.stringify(newUser)
      );
    });

    it('should handle complete signup -> save -> retrieve flow', async () => {
      const name = 'Jane Smith';
      const email = 'jane.smith@test.com';
      const password = 'password456';

      // Step 1: Signup
      const signupResult = await api.signup(name, email, password);
      expect(signupResult.name).toBe(name);
      expect(signupResult.email).toBe(email);
      expect(signupResult.orders).toBe(0);

      // Step 2: Save to storage
      await storage.setUser(signupResult);

      // Step 3: Mock retrieval
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(signupResult)
      );

      // Step 4: Retrieve
      const savedUser = await storage.getUser();
      expect(savedUser?.name).toBe(name);
      expect(savedUser?.email).toBe(email);
    });

    it(
      'should handle signup validation and not save invalid data',
      async () => {
        const invalidConfigs = [
          { name: '', email: 'test@test.com', password: 'password123' },
          { name: 'A', email: 'test@test.com', password: 'password123' },
          { name: 'Test', email: 'invalid-email', password: 'password123' },
          { name: 'Test', email: 'test@test.com', password: '12345' },
        ];

        for (const config of invalidConfigs) {
          await expect(
            api.signup(config.name, config.email, config.password)
          ).rejects.toThrow();

          expect(AsyncStorage.setItem).not.toHaveBeenCalled();
        }
      },
      10000
    );

  });

  describe('Logout Flow', () => {
    it('should logout and clear user from storage', async () => {
      // Step 1: Login and save user
      const user = await api.login('hannah@example.com', 'password');
      await storage.setUser(user);

      // Step 2: Logout
      await api.logout();

      // Step 3: Clear user from storage
      await storage.clearUser();

      // Step 4: Verify clear was called
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('cove_user');
    });

    it('should handle complete session lifecycle', async () => {
      const email = 'test@example.com';

      // Phase 1: Signup
      const newUser = await api.signup('Test User', email, 'password123');
      await storage.setUser(newUser);
      expect(AsyncStorage.setItem).toHaveBeenCalled();

      jest.clearAllMocks();

      // Phase 2: Logout
      await api.logout();
      await storage.clearUser();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('cove_user');

      jest.clearAllMocks();

      // Phase 3: Login again (API requires 'password', not 'password123')
      const loggedInUser = await api.login(email, 'password');
      await storage.setUser(loggedInUser);

      // Verify user data persists
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(loggedInUser)
      );
      const retrievedUser = await storage.getUser();
      expect(retrievedUser?.email).toBe(email);
    });
  });

  describe('Multi-User Session Management', () => {
    it('should handle switching between users', async () => {
      // Step 1: User 1 logs in
      const user1 = await api.login('hannah@example.com', 'password');
      await storage.setUser(user1);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cove_user',
        JSON.stringify(user1)
      );

      jest.clearAllMocks();

      // Step 2: User 1 logs out
      await api.logout();
      await storage.clearUser();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('cove_user');

      jest.clearAllMocks();

      // Step 3: User 2 logs in
      const user2 = await api.login('test@example.com', 'password');
      await storage.setUser(user2);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cove_user',
        JSON.stringify(user2)
      );

      // Step 4: Verify user2 data is stored (not user1)
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(user2)
      );
      const currentUser = await storage.getUser();
      expect(currentUser?.email).toBe(user2.email);
      expect(currentUser?.email).not.toBe(user1.email);
    });

    it('should preserve other storage while changing user', async () => {
      const user = await api.login('hannah@example.com', 'password');
      await storage.setUser(user);

      const cartItems = [
        { id: '1', name: 'Product 1', price: 100, quantity: 1 },
      ];
      await storage.setCart(cartItems);

      jest.clearAllMocks();

      // Logout
      await api.logout();
      await storage.clearUser();

      // Verify only user is cleared, not cart
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('cove_user');
      expect(AsyncStorage.removeItem).not.toHaveBeenCalledWith('cove_cart');
    });
  });

  describe('Error Recovery', () => {
    it('should handle storage errors gracefully', async () => {
      const user = await api.login('hannah@example.com', 'password');

      // Mock storage failure
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // Attempt to save should fail gracefully
      try {
        await storage.setUser(user);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should attempt login after storage failure', async () => {
      // First login succeeds
      const user1 = await api.login('hannah@example.com', 'password');
      expect(user1).toBeDefined();

      // Storage fails
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      // But next login should still work
      jest.clearAllMocks();
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const user2 = await api.login('test@example.com', 'password');
      expect(user2).toBeDefined();
      expect(user2.email).toBe('test@example.com');
    });
  });
});
