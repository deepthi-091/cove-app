import { CATEGORIES } from '../data/mockData';
import { Category } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // NOTE: Product endpoints now use Redux + real API (productsApi.ts)
  // Keep only non-product functions here

  // Categories
  async getCategories(): Promise<Category[]> {
    await delay(200);
    return CATEGORIES;
  },

  // Search - NOTE: Real implementation now uses Redux + productsApi
  async searchProducts(query: string): Promise<any[]> {
    // Placeholder - redirect to Redux/productsApi for real implementation
    await delay(300);
    return [];
  },

  // User authentication
  async login(email: string, password: string): Promise<any> {
    await delay(1000);
    const validEmails = ['hannah@example.com', 'test@example.com', 'user@example.com', 'john@example.com'];
    const validPassword = 'password';

    if (validEmails.includes(email.toLowerCase()) && password === validPassword) {
      return {
        id: '1',
        name: email.split('@')[0],
        email,
        avatar: email.substring(0, 2).toUpperCase(),
        orders: 15,
        reviews: 8,
        purchases: 6,
      };
    }
    throw new Error('Invalid email or password. Try: hannah@example.com / password');
  },

  async logout(): Promise<void> {
    await delay(300);
  },

  async signup(name: string, email: string, password: string): Promise<any> {
    await delay(1500);
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }
    if (name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    return {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      avatar: name.substring(0, 2).toUpperCase(),
      orders: 0,
      reviews: 0,
      purchases: 0,
    };
  },

  // Orders
  async getOrders(): Promise<any[]> {
    await delay(500);
    return [
      {
        id: 'ORD001',
        products: [],
        total: 99.99,
        date: new Date().toISOString(),
        status: 'delivered',
      },
    ];
  },

  async createOrder(items: any[]): Promise<any> {
    await delay(1200);
    return {
      id: `ORD${Date.now()}`,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      status: 'pending',
    };
  },

  // Reviews
  async getProductReviews(productId: string): Promise<any[]> {
    await delay(400);
    return [
      {
        id: '1',
        productId,
        rating: 5,
        text: 'Excellent quality and fast delivery!',
        author: 'John Doe',
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        productId,
        rating: 4,
        text: 'Great product, met my expectations',
        author: 'Jane Smith',
        date: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  },

  async submitReview(productId: string, review: any): Promise<any> {
    await delay(800);
    return {
      id: `REV${Date.now()}`,
      productId,
      ...review,
      date: new Date().toISOString(),
    };
  },

  // Addresses
  async getAddresses(): Promise<any[]> {
    await delay(300);
    return [
      {
        id: '1',
        title: 'Home',
        address: '123 Main St, New York, NY 10001',
        isDefault: true,
      },
    ];
  },

  async addAddress(address: any): Promise<any> {
    await delay(600);
    return {
      id: `ADDR${Date.now()}`,
      ...address,
    };
  },

  // Payment methods
  async getPaymentMethods(): Promise<any[]> {
    await delay(300);
    return [
      {
        id: '1',
        type: 'card',
        last4: '4421',
        brand: 'Visa',
        isDefault: true,
      },
    ];
  },

  async addPaymentMethod(method: any): Promise<any> {
    await delay(800);
    return {
      id: `PAY${Date.now()}`,
      ...method,
    };
  },

  // Error handling wrapper
  async handleError(error: any): Promise<void> {
    console.error('API Error:', error);
    throw error;
  },
};
