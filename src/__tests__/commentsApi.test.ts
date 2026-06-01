/**
 * Comments API Tests
 * Tests for comment operations (create, get, update)
 */

import * as commentsApi from '@/api/comments/commentsApi';
import axiosInstance from '@/utils/axiosInstance';

jest.mock('@/utils/axiosInstance');

describe('Comments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommentsByProduct', () => {
    it('should fetch comments for a product', async () => {
      const mockComments = [
        { id: 1, postId: 1, name: 'John', email: 'john@test.com', body: 'Great!' },
        { id: 2, postId: 1, name: 'Jane', email: 'jane@test.com', body: 'Good product' },
      ];

      (axiosInstance.get as jest.Mock).mockResolvedValue({
        status: 200,
        data: mockComments,
      });

      const result = await commentsApi.getCommentsByProduct(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockComments);
      expect(result.statusCode).toBe(200);
    });

    it('should handle empty comments', async () => {
      (axiosInstance.get as jest.Mock).mockResolvedValue({
        status: 200,
        data: [],
      });

      const result = await commentsApi.getCommentsByProduct(999);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should handle API errors', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      };

      (axiosInstance.get as jest.Mock).mockRejectedValue(error);

      const result = await commentsApi.getCommentsByProduct(1);

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(500);
    });
  });

  describe('createComment', () => {
    it('should create a comment successfully', async () => {
      const payload = {
        name: 'John',
        email: 'john@test.com',
        body: 'Great product!',
        postId: 1,
      };

      const mockResponse = { id: 101, ...payload };

      (axiosInstance.post as jest.Mock).mockResolvedValue({
        status: 201,
        data: mockResponse,
      });

      const result = await commentsApi.createComment(payload);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResponse);
      expect(result.message).toContain('added successfully');
    });

    it('should fail with invalid payload', async () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Invalid request' },
        },
      };

      (axiosInstance.post as jest.Mock).mockRejectedValue(error);

      const result = await commentsApi.createComment({
        name: '',
        email: 'test@test.com',
        body: 'Test',
        postId: 1,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('updateComment', () => {
    it('should update a comment successfully', async () => {
      const payload = {
        name: 'John',
        email: 'john@test.com',
        body: 'Updated comment',
        postId: 1,
      };

      const mockResponse = { id: 1, ...payload };

      (axiosInstance.put as jest.Mock).mockResolvedValue({
        status: 200,
        data: mockResponse,
      });

      const result = await commentsApi.updateComment(1, payload);

      expect(result.success).toBe(true);
      expect(result.data?.body).toBe('Updated comment');
    });

    it('should handle comment not found', async () => {
      const error = {
        response: {
          status: 404,
        },
      };

      (axiosInstance.put as jest.Mock).mockRejectedValue(error);

      const result = await commentsApi.updateComment(999, {
        name: 'test',
        email: 'test@test.com',
        body: 'test',
        postId: 1,
      });

      expect(result.success).toBe(false);
      expect(result.statusCode).toBe(404);
    });
  });
});
