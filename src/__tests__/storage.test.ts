/**
 * Storage Utility Tests
 * Tests for AsyncStorage operations
 */

import { storage } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('Storage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Storage', () => {
    it('should save user data', async () => {
      const userData = {
        id: '1',
        name: 'Hannah',
        email: 'hannah@example.com',
        avatar: 'HA',
      };

      await storage.setUser(userData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cove_user',
        JSON.stringify(userData)
      );
    });

    it('should get user data', async () => {
      const userData = {
        id: '1',
        name: 'Hannah',
        email: 'hannah@example.com',
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(userData));

      const result = await storage.getUser();

      expect(result).toEqual(userData);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('cove_user');
    });

    it('should clear user data', async () => {
      await storage.clearUser();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('cove_user');
    });

    it('should return null when user not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storage.getUser();

      expect(result).toBeNull();
    });
  });

  describe('Cart Storage', () => {
    it('should save cart items', async () => {
      const cartItems = [
        { id: '1', name: 'Product 1', price: 50, quantity: 1 },
        { id: '2', name: 'Product 2', price: 100, quantity: 2 },
      ];

      await storage.setCart(cartItems);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cove_cart',
        JSON.stringify(cartItems)
      );
    });

    it('should get cart items', async () => {
      const cartItems = [
        { id: '1', name: 'Product 1', price: 50, quantity: 1 },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(cartItems));

      const result = await storage.getCart();

      expect(result).toEqual(cartItems);
    });

    it('should return empty array when cart is empty', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await storage.getCart();

      expect(result).toEqual([]);
    });

    it('should clear cart', async () => {
      await storage.clearCart();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('cove_cart');
    });
  });

  describe('Wishlist Storage', () => {
    it('should save wishlist items', async () => {
      const wishlist = ['1', '2', '3'];

      await storage.setWishlist(wishlist);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cove_wishlist',
        JSON.stringify(wishlist)
      );
    });

    it('should toggle item in wishlist', async () => {
      const currentWishlist = ['1', '2'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(currentWishlist));

      await storage.toggleWishlist('3');

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should remove item from wishlist if already exists', async () => {
      const currentWishlist = ['1', '2', '3'];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(currentWishlist));

      await storage.toggleWishlist('2');

      const callArgs = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const newWishlist = JSON.parse(callArgs[1]);

      expect(newWishlist).toEqual(['1', '3']);
    });
  });

  describe('Reviews Storage', () => {
    it('should save reviews', async () => {
      const reviews = [
        { id: '1', productId: '1', rating: 5, text: 'Great!' },
      ];

      await storage.setReviews(reviews);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'cove_reviews',
        JSON.stringify(reviews)
      );
    });

    it('should get reviews', async () => {
      const reviews = [
        { id: '1', productId: '1', rating: 5, text: 'Great!' },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(reviews));

      const result = await storage.getReviews();

      expect(result).toEqual(reviews);
    });

    it('should add a review', async () => {
      const review = { id: '1', productId: '1', rating: 5, text: 'Great!' };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await storage.addReview(review);

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('Clear All Storage', () => {
    it('should clear all storage', async () => {
      await storage.clearAll();

      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
    });
  });
});
