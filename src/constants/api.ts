export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
export const DUMMY_JSON_BASE_URL = 'https://dummyjson.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',

  // Users endpoints
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  CREATE_USER: '/users',
  UPDATE_USER: (id: number) => `/users/${id}`,
  DELETE_USER: (id: number) => `/users/${id}`,

  // Comments endpoints
  COMMENTS: '/comments',
  COMMENTS_BY_POST: (postId: number) => `/comments?postId=${postId}`,
  COMMENT_BY_ID: (id: number) => `/comments/${id}`,
  CREATE_COMMENT: '/comments',
  UPDATE_COMMENT: (id: number) => `/comments/${id}`,
};

export const PRODUCT_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  PRODUCTS_SEARCH: (q: string) => `/products/search?q=${q}`,
  PRODUCTS_BY_CATEGORY: (cat: string) => `/products/category/${cat}`,
  PRODUCT_CATEGORIES: '/products/categories',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_REQUEST: 'Invalid request. Please check your input.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};
