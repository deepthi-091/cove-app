import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Product } from '../types';
import { COLORS, SIZES } from '../constants';
import { RatingStars } from './RatingStars';
import { storage } from '@/utils/storage';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - SIZES.screenPadding * 2 - SIZES.md) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
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

  const handleWishlist = async (e: any) => {
    e.stopPropagation();
    try {
      const updated = await storage.toggleWishlist(product.id);
      setIsWishlisted(updated.includes(product.id));
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.container}
    >
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
        <TouchableOpacity
          onPress={handleWishlist}
          style={styles.wishlistButton}
        >
          <Text style={styles.wishlistIcon}>
            {isWishlisted ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingContainer}>
          <RatingStars rating={Math.round(product.rating)} size="sm" />
          <Text style={styles.reviewCount}>{product.reviews}</Text>
        </View>

        <Text style={styles.price}>${product.price}</Text>
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
    position: 'absolute',
    top: SIZES.md,
    right: SIZES.md,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.borderRadius.sm,
  },
  saleText: {
    color: COLORS.white,
    fontSize: SIZES.fontSize.xs,
    fontWeight: '600',
  },
  wishlistButton: {
    position: 'absolute',
    bottom: SIZES.md,
    right: SIZES.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wishlistIcon: {
    fontSize: 20,
  },
  content: {
    paddingHorizontal: SIZES.sm,
  },
  name: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  reviewCount: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
    marginLeft: SIZES.sm,
  },
  price: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
});
