import React from 'react';
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
