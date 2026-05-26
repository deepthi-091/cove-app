import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { STRINGS } from '@/constants/strings';
import { Button, RatingStars, CommentsSection, ReviewModal, LoginBadge } from '@/components';
import { storage } from '@/utils/storage';
import { useAuth } from '@/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProductByIdRequest } from '@/redux/products/productSagaActions';
import { setSelectedProduct } from '@/redux/products/productSlice';
import { addToCart } from '@/redux/cart/cartActions';
import type { Review } from '@/types';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { selectedProduct: product, loading } = useAppSelector(state => state.products);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    dispatch(fetchProductByIdRequest(id as string));
    loadWishlistStatus();
    loadReviews();
    return () => {
      dispatch(setSelectedProduct(null));
    };
  }, [id, dispatch]);

  const loadWishlistStatus = async () => {
    try {
      const wishlist = await storage.getWishlist();
      setIsWishlisted(wishlist && Array.isArray(wishlist) && wishlist.includes(id as string));
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const loadReviews = async () => {
    try {
      const storedReviews = await storage.getReviews(id as string);
      setReviews(Array.isArray(storedReviews) ? storedReviews : []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setReviews([]);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!product) return;
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        color: product.colors?.[selectedColor],
        size: product.sizes?.[selectedSize],
      })
    );
    router.push('/cart');
  };

  const handleWishlist = async () => {
    const updated = await storage.toggleWishlist(product!.id);
    setIsWishlisted(updated.includes(product!.id));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/tabs' as any)}>
            <Text style={styles.backButton}>‹ Back</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <LoginBadge />
            <TouchableOpacity
              onPress={handleWishlist}
              style={styles.wishlistButton}
            >
              <Text style={styles.wishlistIcon}>
                {isWishlisted ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.ratingContainer}>
            <RatingStars rating={Math.round(product.rating)} />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews} reviews)</Text>
          </View>

          <Text style={styles.price}>${product.price}</Text>

          <View style={styles.freeDelivery}>
            <Text style={styles.freeDeliveryIcon}>🚚</Text>
            <View>
              <Text style={styles.freeDeliveryText}>{STRINGS.product_free_delivery}</Text>
              <Text style={styles.deliveryDate}>Arrives Tue, May 25 - Wed, May 29</Text>
            </View>
          </View>

          {product.colors && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{STRINGS.product_color}</Text>
              <View style={styles.colorGrid}>
                {product.colors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedColor(index)}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === index && styles.selectedColor,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          {product.sizes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{STRINGS.product_size}</Text>
              <View style={styles.sizeGrid}>
                {product.sizes.map((size, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedSize(index)}
                    style={[
                      styles.sizeOption,
                      selectedSize === index && styles.selectedSize,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === index && styles.selectedSizeText,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{STRINGS.product_details}</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          <Button
            label={isAuthenticated ? `${STRINGS.product_add_to_bag} - $${product.price}` : 'Login to Add to Bag'}
            onPress={handleAddToCart}
          />

          <TouchableOpacity style={styles.reviewButton} onPress={() => setShowReviewModal(true)}>
            <Text style={styles.reviewButtonText}>✍️ Write a review</Text>
          </TouchableOpacity>

          {reviews.length > 0 && (
            <View style={styles.reviewsContainer}>
              <Text style={styles.reviewsTitle}>Your Reviews ({reviews.length})</Text>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewRating}>
                      <Text style={styles.stars}>{'⭐'.repeat(review.rating)}</Text>
                      <Text style={styles.ratingText}>{review.rating}/5</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                  {review.images && review.images.length > 0 && (
                    <Image source={{ uri: review.images[0] }} style={styles.reviewImage} />
                  )}
                  <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</Text>
                </View>
              ))}
            </View>
          )}

          <ReviewModal
            visible={showReviewModal}
            productId={id as string}
            onClose={() => setShowReviewModal(false)}
            onSubmit={(newReview) => {
              setReviews([newReview, ...reviews]);
            }}
          />

          {/* Comments Section */}
          {product && <CommentsSection productId={Number(product.id) || 1} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: SIZES.fontSize.base,
    color: COLORS.lightText,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  backButton: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  wishlistButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistIcon: {
    fontSize: 24,
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: COLORS.lightGray,
  },
  content: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.xl,
  },
  category: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
    fontWeight: '600',
    marginBottom: SIZES.sm,
  },
  name: {
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  rating: {
    marginLeft: SIZES.md,
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  reviews: {
    marginLeft: SIZES.sm,
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
  },
  price: {
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  freeDelivery: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    padding: SIZES.lg,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.xl,
  },
  freeDeliveryIcon: {
    fontSize: 24,
    marginRight: SIZES.lg,
  },
  freeDeliveryText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  deliveryDate: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: SIZES.borderRadius.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  selectedColor: {
    borderColor: COLORS.primary,
  },
  sizeGrid: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  sizeOption: {
    flex: 1,
    paddingVertical: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.md,
    alignItems: 'center',
  },
  selectedSize: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedSizeText: {
    color: COLORS.white,
  },
  description: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.darkGray,
    lineHeight: 22,
  },
  reviewButton: {
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    marginTop: SIZES.lg,
  },
  reviewButtonText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  reviewsContainer: {
    marginVertical: SIZES.xl,
  },
  reviewsTitle: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  reviewItem: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadius.md,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
  },
  reviewHeader: {
    marginBottom: SIZES.md,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  stars: {
    fontSize: SIZES.fontSize.base,
  },
  ratingText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
  },
  reviewText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SIZES.md,
  },
  reviewImage: {
    width: '100%',
    height: 150,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.md,
  },
  reviewDate: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
  },
});
