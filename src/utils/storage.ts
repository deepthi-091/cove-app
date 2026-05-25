import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: 'cove_user',
  PRODUCTS: 'cove_products',
  CART: 'cove_cart',
  WISHLIST: 'cove_wishlist',
  REVIEWS: 'cove_reviews',
};

export const storage = {
  // User storage
  async setUser(user: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser() {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async clearUser() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  },

  // Cart storage
  async setCart(items: any[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },

  async getCart() {
    try {
      const cart = await AsyncStorage.getItem(STORAGE_KEYS.CART);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  },

  async clearCart() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CART);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },

  // Wishlist storage
  async setWishlist(items: string[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  },

  async getWishlist() {
    try {
      const wishlist = await AsyncStorage.getItem(STORAGE_KEYS.WISHLIST);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }
  },

  async toggleWishlist(productId: string) {
    try {
      const wishlist = await this.getWishlist();
      const updated = wishlist.includes(productId)
        ? wishlist.filter((id: string) => id !== productId)
        : [...wishlist, productId];
      await this.setWishlist(updated);
      return updated;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return [];
    }
  },

  // Reviews storage
  async setReviews(reviews: any[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch (error) {
      console.error('Error saving reviews:', error);
    }
  },

  async getReviews() {
    try {
      const reviews = await AsyncStorage.getItem(STORAGE_KEYS.REVIEWS);
      return reviews ? JSON.parse(reviews) : [];
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    }
  },

  async addReview(review: any) {
    try {
      const reviews = await this.getReviews();
      const updated = [...reviews, { id: Date.now(), ...review }];
      await this.setReviews(updated);
      return updated;
    } catch (error) {
      console.error('Error adding review:', error);
      return [];
    }
  },

  // Clear all storage
  async clearAll() {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing all storage:', error);
    }
  },
};
