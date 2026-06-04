import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { Button, LoginBadge, CommentsSection, ReviewModal } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProductByIdRequest } from '@/redux/products/productSagaActions';
import { setSelectedProduct } from '@/redux/products/productSlice';
import { addToCart } from '@/redux/cart/cartActions';
import { storage } from '@/utils/storage';
import type { Review } from '@/types';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { selectedProduct: product, loading } = useAppSelector(state => state.products);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (id) {
      console.log('📡 Fetching product:', id);
      dispatch(fetchProductByIdRequest(id as string));
      loadReviews();
    }

    return () => {
      dispatch(setSelectedProduct(null));
    };
  }, [id, dispatch]);

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

    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    }));
    Alert.alert('Success', 'Added to cart!');
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>‹ Back</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 16, color: COLORS.lightText }}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>‹ Back</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 16, color: COLORS.lightText, textAlign: 'center' }}>Product not found</Text>
          <Button label="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView testID="productDetailScreen" style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>‹ Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            <LoginBadge />
            <TouchableOpacity onPress={() => setIsWishlisted(!isWishlisted)}>
              <Text style={{ fontSize: 24 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product Image */}
        <Image
          source={{ uri: product.image }}
          style={{ width: '100%', height: 300, backgroundColor: COLORS.lightGray }}
          resizeMode="cover"
        />

        {/* Product Info */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          {/* Category */}
          <Text style={{ fontSize: 12, color: COLORS.lightText, fontWeight: '600', marginBottom: 4 }}>
            {product.category}
          </Text>

          {/* Name */}
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>
            {product.name}
          </Text>

          {/* Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 16 }}>⭐ {product.rating}</Text>
            <Text style={{ fontSize: 14, color: COLORS.lightText, marginLeft: 8 }}>
              ({product.reviews} reviews)
            </Text>
          </View>

          {/* Price */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginBottom: 20 }}>
            ${product.price}
          </Text>

          {/* Description */}
          {product.description && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 }}>
                About this product
              </Text>
              <Text style={{ fontSize: 14, color: COLORS.darkGray, lineHeight: 20 }}>
                {product.description}
              </Text>
            </View>
          )}

          {/* Stock Status */}
          <View style={{ backgroundColor: COLORS.lightGray, padding: 12, borderRadius: 8, marginBottom: 24 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>
              ✓ In Stock
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.lightText, marginTop: 4 }}>
              Free delivery on orders over $50
            </Text>
          </View>

          {/* Add to Cart Button */}
          <Button
            testID="addToCartButton"
            label={isAuthenticated ? `Add to Cart - $${product.price}` : 'Login to Add to Cart'}
            onPress={handleAddToCart}
          />

          {/* Write Review Button */}
          <TouchableOpacity
            style={{ paddingVertical: 16, alignItems: 'center' }}
            onPress={() => setShowReviewModal(true)}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary }}>✍️ Write a Review</Text>
          </TouchableOpacity>

          {/* Existing Reviews */}
          {reviews.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 }}>
                Your Reviews ({reviews.length})
              </Text>
              {reviews.map((review) => (
                <View
                  key={review.id}
                  style={{
                    backgroundColor: COLORS.lightGray,
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.text }}>
                      {'⭐'.repeat(review.rating)} {review.rating}/5
                    </Text>
                    <Text style={{ fontSize: 12, color: COLORS.lightText }}>
                      {new Date(review.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: COLORS.text, lineHeight: 20 }}>
                    {review.text}
                  </Text>
                  {review.images && review.images.length > 0 && (
                    <Image
                      source={{ uri: review.images[0] }}
                      style={{ width: '100%', height: 150, borderRadius: 8, marginTop: 8 }}
                      resizeMode="cover"
                    />
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ReviewModal */}
        <ReviewModal
          productId={id as string}
          visible={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={(newReview) => {
            setReviews([newReview, ...reviews]);
            setShowReviewModal(false);
          }}
        />

        {/* Comments Section */}
        <CommentsSection testID="commentsSection" productId={Number(product.id) || 1} />
      </ScrollView>
    </SafeAreaView>
  );
}
