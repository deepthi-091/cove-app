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