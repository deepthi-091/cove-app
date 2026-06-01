/**
 * Authentication Tests
 * Tests for login, signup, and logout functionality
 */

import { api } from '@/utils/api';

describe('Authentication', () => {
  describe('Login', () => {
    it('should login with valid credentials', async () => {
      const result = await api.login('hannah@example.com', 'password');

      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(result.email).toBe('hannah@example.com');
      expect(result.name).toBe('hannah');
    });

    it('should fail with invalid email', async () => {
      await expect(
        api.login('invalid@example.com', 'password')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should fail with invalid password', async () => {
      await expect(
        api.login('hannah@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });

    it('should return user object with correct properties', async () => {
      const result = await api.login('test@example.com', 'password');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('avatar');
      expect(result).toHaveProperty('orders');
      expect(result).toHaveProperty('reviews');
      expect(result).toHaveProperty('purchases');
    });

    it('should extract name from email', async () => {
      const result = await api.login('john@example.com', 'password');
      expect(result.name).toBe('john');
    });
  });

  describe('Signup', () => {
    it('should signup with valid data', async () => {
      const result = await api.signup('John Doe', 'john@test.com', 'password123');

      expect(result).toBeDefined();
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@test.com');
    });

    it('should fail with missing name', async () => {
      await expect(
        api.signup('', 'john@test.com', 'password123')
      ).rejects.toThrow('All fields are required');
    });

    it('should fail with name too short', async () => {
      await expect(
        api.signup('J', 'john@test.com', 'password123')
      ).rejects.toThrow('Name must be at least 2 characters');
    });

    it('should fail with invalid email format', async () => {
      await expect(
        api.signup('John', 'invalid-email', 'password123')
      ).rejects.toThrow('Invalid email format');
    });

    it('should fail with password too short', async () => {
      await expect(
        api.signup('John', 'john@test.com', '12345')
      ).rejects.toThrow('Password must be at least 6 characters');
    });

    it('should return correct user object', async () => {
      const result = await api.signup('Jane Smith', 'jane@test.com', 'password123');

      expect(result.name).toBe('Jane Smith');
      expect(result.email).toBe('jane@test.com');
      expect(result.orders).toBe(0);
      expect(result.reviews).toBe(0);
      expect(result.purchases).toBe(0);
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const result = await api.logout();
      expect(result).toBeUndefined();
    });
  });
});
