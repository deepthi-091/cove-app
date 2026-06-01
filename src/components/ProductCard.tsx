import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Product } from '../types';
import { COLORS, SIZES } from '../constants';
import { RatingStars } from './RatingStars';
import { storage } from '@/utils/storage';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - SIZES.screenPadding * 2 - SIZES.md) / 2;

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onAddToCart }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Reanimated — like button heart scale
  const heartScale = useSharedValue(1);
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  // Animated API — card press scale
  const cardScale = useRef(new Animated.Value(1)).current;

  // Reanimated — swipe translation
  const translateX = useSharedValue(0);
  const swipeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

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

  const triggerWishlistAnimation = () => {
    heartScale.value = withSequence(
      withSpring(1.5, { damping: 3, stiffness: 300 }),
      withSpring(1, { damping: 6, stiffness: 200 })
    );
  };

  const handleWishlistToggle = async () => {
    try {
      const updated = await storage.toggleWishlist(product.id);
      setIsWishlisted(updated.includes(product.id));
      triggerWishlistAnimation();
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const handleAddToCartFeedback = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
    if (onAddToCart) onAddToCart();
  };

  const showLongPressMenu = () => {
    Alert.alert(product.name, 'What would you like to do?', [
      { text: '❤️ Add to Wishlist', onPress: handleWishlistToggle },
      { text: '🛒 Add to Cart', onPress: handleAddToCartFeedback },
      { text: '🔍 View Details', onPress: onPress },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Gesture: swipe right → add to cart, swipe left → wishlist
  const panGesture = Gesture.Pan()
    .minDistance(30)
    .onUpdate((e) => {
      if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
        translateX.value = e.translationX * 0.3;
      }
    })
    .onEnd((e) => {
      if (e.translationX > 80) {
        runOnJS(handleAddToCartFeedback)();
      } else if (e.translationX < -80) {
        runOnJS(handleWishlistToggle)();
      }
      translateX.value = withSpring(0);
    });

  // Gesture: long press → options menu
  const longPressGesture = Gesture.LongPress()
    .minDuration(600)
    .onStart(() => {
      runOnJS(showLongPressMenu)();
    });

  // Gesture: tap → open product details
  const tapGesture = Gesture.Tap()
    .maxDuration(200)
    .onFinalize(() => {
      console.log('Tap gesture detected on product card');
      runOnJS(handleTap)();
    });

  // Combine gestures: Exclusive tries in order (tap first, then pan/longpress)
  const combinedGesture = Gesture.Exclusive(
    tapGesture,
    Gesture.Race(panGesture, longPressGesture)
  );

  const handlePressIn = () => {
    console.log('ProductCard: handlePressIn');
    Animated.spring(cardScale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  };

  const handlePressOut = () => {
    console.log('ProductCard: handlePressOut - calling onPress');
    Animated.spring(cardScale, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  };

  const handleTap = () => {
    try {
      console.log('ProductCard: handleTap - navigating to product', product.id, 'type:', typeof product.id);
      if (!product.id) {
        console.error('ProductCard: ERROR - product.id is missing!');
        Alert.alert('Error', 'Product ID is missing');
        return;
      }
      onPress();
    } catch (error) {
      console.error('ProductCard: ERROR in handleTap:', error);
      Alert.alert('Error', 'Failed to open product: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        try {
          console.log('TouchableOpacity pressed - navigating to product:', product.id);
          handleTap();
        } catch (error) {
          console.error('TouchableOpacity error:', error);
          Alert.alert('Error', 'Navigation failed: ' + (error instanceof Error ? error.message : String(error)));
        }
      }}
    >
      <Reanimated.View style={[styles.container, swipeAnimatedStyle]}>
        <Animated.View style={{ transform: [{ scale: cardScale }] }}>
          {/* Swipe hint overlay */}
          {addedToCart && (
            <View style={styles.addedOverlay}>
              <Text style={styles.addedOverlayText}>🛒 Added!</Text>
            </View>
          )}

          {/* Tappable card - wrapped in gesture detector for swipe/longpress */}
          <GestureDetector gesture={combinedGesture}>
            <Reanimated.View>
              <View
                style={styles.imageContainer}
              >
                <Animated.Image
                  source={{ uri: product.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {product.onSale && (
                  <View style={styles.saleTag}>
                    <Text style={styles.saleText}>SALE</Text>
                  </View>
                )}

                {/* Like button — Reanimated scale */}
                <Reanimated.View style={[styles.wishlistButton, heartAnimatedStyle]}>
                  <Text
                    style={styles.wishlistIcon}
                    onPress={handleWishlistToggle}
                  >
                    {isWishlisted ? '❤️' : '🤍'}
                  </Text>
                </Reanimated.View>
              </View>

              <View
                style={styles.content}
              >
                <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
                <View style={styles.ratingContainer}>
                  <RatingStars rating={Math.round(product.rating)} size="sm" />
                  <Text style={styles.reviewCount}>{product.reviews}</Text>
                </View>
                <Text style={styles.price}>${product.price}</Text>
              </View>

              {/* Swipe hint labels */}
              <View style={styles.swipeHint}>
                <Text style={styles.swipeHintText}>← ❤️  🛒 →</Text>
              </View>
            </Reanimated.View>
          </GestureDetector>
        </Animated.View>
      </Reanimated.View>
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
  price: { fontSize: SIZES.fontSize.base, fontWeight: '600', color: COLORS.text },
  swipeHint: { alignItems: 'center', marginTop: SIZES.xs },
  swipeHintText: { fontSize: 10, color: COLORS.lightText },
});
