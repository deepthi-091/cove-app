import axiosInstance from '@/utils/axiosInstance';
import { API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  statusCode: number;
}

export interface Comment {
  id?: number | string;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface CommentPayload {
  name: string;
  email: string;
  body: string;
  postId: number;
}

class CommentsApiService {
  /**
   * Fetch all comments for a product (post)
   */
  async getCommentsByProduct(productId: number): Promise<ApiResponse<Comment[]>> {
    try {
      const response = await axiosInstance.get<Comment[]>(
        API_ENDPOINTS.COMMENTS_BY_POST(productId)
      );

      if (response.status === HTTP_STATUS.OK) {
        return {
          success: true,
          data: response.data,
          message: 'Comments fetched successfully',
          statusCode: response.status,
        };
      }

      return {
        success: false,
        data: null,
        message: ERROR_MESSAGES.UNKNOWN_ERROR,
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      return {
        success: false,
        data: null,
        message: this.handleError(error),
        statusCode: error.response?.status || 0,
      };
    }
  }

  /**
   * Get single comment
   */
  async getCommentById(id: number): Promise<ApiResponse<Comment>> {
    try {
      const response = await axiosInstance.get<Comment>(
        API_ENDPOINTS.COMMENT_BY_ID(id)
      );

      if (response.status === HTTP_STATUS.OK) {
        return {
          success: true,
          data: response.data,
          message: 'Comment fetched successfully',
          statusCode: response.status,
        };
      }

      return {
        success: false,
        data: null,
        message: ERROR_MESSAGES.UNKNOWN_ERROR,
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error fetching comment:', error);
      return {
        success: false,
        data: null,
        message: this.handleError(error),
        statusCode: error.response?.status || 0,
      };
    }
  }

  /**
   * Create a new comment
   */
  async createComment(payload: CommentPayload): Promise<ApiResponse<Comment>> {
    try {
      const response = await axiosInstance.post<Comment>(
        API_ENDPOINTS.CREATE_COMMENT,
        payload
      );

      if (response.status === HTTP_STATUS.CREATED) {
        const message = `Comment by ${payload.name} added successfully`;
        return {
          success: true,
          data: response.data,
          message,
          statusCode: response.status,
        };
      }

      return {
        success: false,
        data: null,
        message: ERROR_MESSAGES.UNKNOWN_ERROR,
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error creating comment:', error);
      return {
        success: false,
        data: null,
        message: this.handleError(error),
        statusCode: error.response?.status || 0,
      };
    }
  }

  /**
   * Update comment
   */
  async updateComment(id: number, payload: Partial<CommentPayload>): Promise<ApiResponse<Comment>> {
    try {
      const response = await axiosInstance.put<Comment>(
        API_ENDPOINTS.UPDATE_COMMENT(id),
        payload
      );

      if (response.status === HTTP_STATUS.OK) {
        const message = 'Comment updated successfully';
        return {
          success: true,
          data: response.data,
          message,
          statusCode: response.status,
        };
      }

      return {
        success: false,
        data: null,
        message: ERROR_MESSAGES.UNKNOWN_ERROR,
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error updating comment:', error);
      return {
        success: false,
        data: null,
        message: this.handleError(error),
        statusCode: error.response?.status || 0,
      };
    }
  }

  /**
   * Handle and map errors
   */
  private handleError(error: any): string {
    if (!error.response) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }

    const status = error.response.status;

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return ERROR_MESSAGES.INVALID_REQUEST;
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        return error.response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }
}

export default new CommentsApiService();
