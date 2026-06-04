import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Product } from '../types';
import { COLORS, SIZES } from '../constants';
import { RatingStars } from './RatingStars';
import { storage } from '@/utils/storage';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart?: () => void;
  testID?: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - SIZES.screenPadding * 2 - SIZES.md) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onAddToCart, testID }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    loadWishlistStatus();
  }, [product.id]);

  const loadWishlistStatus = async () => {
    try {
      const wishlist = await storage.getWishlist();
      setIsWishlisted(wishlist.includes(product.id));
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const updated = await storage.toggleWishlist(product.id);
      setIsWishlisted(updated.includes(product.id));
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const handleAddToCartFeedback = () => {
    if (onAddToCart) onAddToCart();
  };

  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {product.onSale && (
            <View style={styles.saleTag}>
              <Text style={styles.saleText}>SALE</Text>
            </View>
          )}

          {/* Like button */}
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={handleWishlistToggle}
          >
            <Text style={styles.wishlistIcon}>
              {isWishlisted ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <View style={styles.ratingContainer}>
            <RatingStars rating={Math.round(product.rating)} size="sm" />
            <Text style={styles.reviewCount}>{product.reviews}</Text>
          </View>
          <Text style={styles.price}>${product.price}</Text>
        </View>

        {/* Add to cart button */}
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCartFeedback}
        >
          <Text style={styles.addToCartText}>🛒 Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginRight: SIZES.md,
    marginBottom: SIZES.xl,
  },
  addedOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(76,175,80,0.85)',
    borderRadius: SIZES.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  addedOverlayText: {
    color: '#fff',
    fontSize: SIZES.fontSize.lg,
    fontWeight: '700',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: SIZES.md,
    borderRadius: SIZES.borderRadius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: cardWidth,
    backgroundColor: COLORS.lightGray,
  },
  saleTag: {
    position: 'absolute', top: SIZES.md, left: SIZES.md,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.xs, paddingHorizontal: SIZES.md,
    borderRadius: SIZES.borderRadius.sm,
  },
  saleText: { color: COLORS.white, fontSize: SIZES.fontSize.xs, fontWeight: '700' },
  wishlistButton: {
    position: 'absolute', bottom: SIZES.md, right: SIZES.md,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
  },
  wishlistIcon: { fontSize: 20 },
  content: { paddingHorizontal: SIZES.sm },
  name: {
    fontSize: SIZES.fontSize.sm, fontWeight: '600',
    color: COLORS.text, marginBottom: SIZES.sm, lineHeight: 18,
  },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.sm },
  reviewCount: { fontSize: SIZES.fontSize.xs, color: COLORS.lightText, marginLeft: SIZES.sm },
  price: { fontSize: SIZES.fontSize.base, fontWeight: '600', color: COLORS.text, marginBottom: SIZES.md },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.borderRadius.md,
    alignItems: 'center',
    marginTop: SIZES.sm,
  },
  addToCartText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.fontSize.sm,
  },
});
