/**
 * Users API Tests
 * Tests for user CRUD operations
 */

import * as usersApi from '@/api/users/usersApi';
import axiosInstance from '@/utils/axiosInstance';

jest.mock('@/utils/axiosInstance');

describe('Users API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch all users', async () => {
      const mockUsers = [
        { id: 1, name: 'Hannah', email: 'hannah@example.com', username: 'hannah' },
        { id: 2, name: 'John', email: 'john@example.com', username: 'john' },
      ];

      (axiosInstance.get as jest.Mock).mockResolvedValue({
        status: 200,
        data: mockUsers,
      });

      const result = await usersApi.getUsers();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUsers);
      expect(result.data?.length).toBe(2);
    });

    it('should handle empty users list', async () => {
      (axiosInstance.get as jest.Mock).mockResolvedValue({
        status: 200,
        data: [],
      });

      const result = await usersApi.getUsers();

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(0);
    });

    it('should handle API errors', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      };

      (axiosInstance.get as jest.Mock).mockRejectedValue(error);

      const result = await usersApi.getUsers();

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        username: 'jane',
        phone: '1234567890',
        website: 'jane.com',
        company: { name: 'Tech Co' },
      };

      const mockResponse = { id: 3, ...userData };

      (axiosInstance.post as jest.Mock).mockResolvedValue({
        status: 201,
        data: mockResponse,
      });

      const result = await usersApi.createUser(userData);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('Jane Doe');
      expect(result.statusCode).toBe(201);
    });

    it('should handle duplicate email error', async () => {
      const error = {
        response: {
          status: 409,
          data: { message: 'Email already exists' },
        },
      };

      (axiosInstance.post as jest.Mock).mockRejectedValue(error);

      const result = await usersApi.createUser({
        name: 'Test',
        email: 'test@example.com',
        username: 'test',
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(409);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const userData = {
        name: 'Hannah Updated',
        email: 'hannah@example.com',
        username: 'hannah_updated',
      };

      const mockResponse = { id: 1, ...userData };

      (axiosInstance.put as jest.Mock).mockResolvedValue({
        status: 200,
        data: mockResponse,
      });

      const result = await usersApi.updateUser(1, userData);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('Hannah Updated');
    });

    it('should handle user not found', async () => {
      const error = {
        response: {
          status: 404,
        },
      };

      (axiosInstance.put as jest.Mock).mockRejectedValue(error);

      const result = await usersApi.updateUser(999, {
        name: 'Test',
        email: 'test@example.com',
        username: 'test',
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      (axiosInstance.delete as jest.Mock).mockResolvedValue({
        status: 200,
      });

      const result = await usersApi.deleteUser(1);

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(result.message).toContain('deleted successfully');
    });

    it('should handle delete with 204 status', async () => {
      (axiosInstance.delete as jest.Mock).mockResolvedValue({
        status: 204,
      });

      const result = await usersApi.deleteUser(1);

      expect(result.success).toBe(true);
    });

    it('should handle user not found on delete', async () => {
      const error = {
        response: {
          status: 404,
        },
      };

      (axiosInstance.delete as jest.Mock).mockRejectedValue(error);

      const result = await usersApi.deleteUser(999);

      expect(result.success).toBe(false);
    });
  });
});
