import axiosInstance from '@/utils/axiosInstance';
import { API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';
import { User } from '@/types';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  statusCode: number;
}

export interface UserPayload {
  name: string;
  email: string;
  username: string;
  phone?: string;
  website?: string;
  company?: {
    name: string;
  };
}

class UsersApiService {
  /**
   * Fetch all users
   */
  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await axiosInstance.get<User[]>(API_ENDPOINTS.USERS);

      if (response.status === HTTP_STATUS.OK) {
        return {
          success: true,
          data: response.data,
          message: 'Users fetched successfully',
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
      console.error('Error fetching users:', error);
      return {
        success: false,
        data: null,
        message: this.handleError(error),
        statusCode: error.response?.status || 0,
      };
    }
  }

  /**
   * Fetch user by ID
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    try {
      const response = await axiosInstance.get<User>(
        API_ENDPOINTS.USER_BY_ID(id)
      );

      if (response.status === HTTP_STATUS.OK) {
        return {
          success: true,
          data: response.data,
          message: 'User fetched successfully',
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
      console.error('Error fetching user:', error);
      return {
        success: false,
        data: null,
        message: this.handleError(error),
        statusCode: error.response?.status || 0,
      };
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: UserPayload): Promise<ApiResponse<User>> {
    try {
      const response = await axiosInstance.post<User>(
        API_ENDPOINTS.CREATE_USER,
        userData
      );

      if (response.status === HTTP_STATUS.CREATED) {
        const message = `${userData.username} added successfully`;
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
      console.error('Error creating user:', error);
      return {
        success: false,
        data: null,
        message: this.handleError(error),
        statusCode: error.response?.status || 0,
      };
    }
  }

  /**
   * Update user
   */
  async updateUser(id: number, userData: Partial<UserPayload>): Promise<ApiResponse<User>> {
    try {
      const response = await axiosInstance.put<User>(
        API_ENDPOINTS.UPDATE_USER(id),
        userData
      );

      if (response.status === HTTP_STATUS.OK) {
        const message = `${userData.username || 'User'} updated successfully`;
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
      console.error('Error updating user:', error);
      return {
        success: false,
        data: null,
        message: this.handleError(error),
        statusCode: error.response?.status || 0,
      };
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await axiosInstance.delete(
        API_ENDPOINTS.DELETE_USER(id)
      );

      if (response.status === HTTP_STATUS.OK || response.status === HTTP_STATUS.NO_CONTENT) {
        return {
          success: true,
          data: null,
          message: 'User deleted successfully',
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
      console.error('Error deleting user:', error);
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

export default new UsersApiService();
