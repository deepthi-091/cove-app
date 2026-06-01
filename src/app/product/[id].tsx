import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { Button, LoginBadge } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProductByIdRequest } from '@/redux/products/productSagaActions';
import { setSelectedProduct } from '@/redux/products/productSlice';
import { addToCart } from '@/redux/cart/cartActions';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { selectedProduct: product, loading } = useAppSelector(state => state.products);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      console.log('📡 Fetching product:', id);
      dispatch(fetchProductByIdRequest(id as string));
    }

    return () => {
      dispatch(setSelectedProduct(null));
    };
  }, [id, dispatch]);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
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
            label={isAuthenticated ? `Add to Cart - $${product.price}` : 'Login to Add to Cart'}
            onPress={handleAddToCart}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
