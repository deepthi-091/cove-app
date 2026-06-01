import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { STRINGS } from '@/constants/strings';
import { CategoryBar, ProductCard, LoginBadge } from '@/components';
import { CATEGORIES } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProductsRequest } from '@/redux/products/productSagaActions';
import { setSelectedCategory as setSelectedCategoryRedux } from '@/redux/products/productSlice';
import { addToCart } from '@/redux/cart/cartActions';
import type { Category } from '@/types';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { products, loading, selectedCategory, categories } = useAppSelector(state => state.products);
  const cartTotal = useAppSelector(state => state.cart.totalItems);
  const [searchQuery, setSearchQuery] = useState('');
  const displayCategories: Category[] = categories.length > 0 ? categories : CATEGORIES;

  // Animated cart badge bounce
  const cartBounce = useRef(new Animated.Value(1)).current;
  const prevCartTotal = useRef(cartTotal);

  useEffect(() => {
    if (cartTotal !== prevCartTotal.current) {
      Animated.sequence([
        Animated.spring(cartBounce, { toValue: 1.4, useNativeDriver: true, speed: 40 }),
        Animated.spring(cartBounce, { toValue: 1, useNativeDriver: true, speed: 20 }),
      ]).start();
      prevCartTotal.current = cartTotal;
    }
  }, [cartTotal]);

  useEffect(() => {
    dispatch(fetchProductsRequest({ category: selectedCategory }));
  }, [selectedCategory, dispatch]);

  const handleCategoryChange = (categoryId: string) => {
    dispatch(setSelectedCategoryRedux(categoryId));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      dispatch(fetchProductsRequest({ search: query }));
    } else {
      dispatch(fetchProductsRequest({ category: selectedCategory }));
    }
  };

  const handleSwipeAddToCart = useCallback((product: any) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    }));
  }, [isAuthenticated, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => {
                try {
                  console.log('Home screen: Navigating to product', item.id, 'type:', typeof item.id);
                  router.push({
                    pathname: '/product/[id]',
                    params: { id: String(item.id) }
                  } as any);
                } catch (error) {
                  console.error('Home screen navigation error:', error);
                  Alert.alert('Error', 'Failed to navigate to product');
                }
              }}
              onAddToCart={() => handleSwipeAddToCart(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <View>
                  <Text style={styles.logo}>C</Text>
                  {user && <Text style={styles.greeting}>Welcome, {user.name}!</Text>}
                </View>
                <View style={styles.headerRight}>
                  <LoginBadge />
                  <TouchableOpacity
                    style={styles.cartIcon}
                    onPress={() => router.push('/cart' as any)}
                  >
                    <Text style={styles.cartText}>🛒</Text>
                    {cartTotal > 0 && (
                      <Animated.View style={[styles.cartBadge, { transform: [{ scale: cartBounce }] }]}>
                        <Text style={styles.cartBadgeText}>{cartTotal}</Text>
                      </Animated.View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.title}>{STRINGS.home_discover}</Text>

              <View style={styles.searchBar}>
                <TextInput
                  placeholder={STRINGS.home_search}
                  placeholderTextColor={COLORS.lightText}
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
              </View>

              <CategoryBar
                categories={displayCategories}
                selectedId={selectedCategory}
                onSelectCategory={handleCategoryChange}
              />

              <View style={styles.banner}>
                <Text style={styles.bannerLabel}>{STRINGS.home_spring_sale}</Text>
                <Text style={styles.bannerText}>{STRINGS.home_sale_text}</Text>
                <TouchableOpacity style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>{STRINGS.home_shop_now} →</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.trendingHeader}>
                <Text style={styles.trendingTitle}>{STRINGS.home_trending}</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllLink}>{STRINGS.home_see_all}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.gestureHint}>💡 Swipe card right to cart · left to wishlist · long-press for options</Text>
            </>
          }
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: SIZES.fontSize.sm, color: COLORS.lightText, marginTop: SIZES.md },
  listContent: { paddingHorizontal: SIZES.screenPadding },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: SIZES.xl, paddingVertical: SIZES.sm,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: SIZES.sm },
  logo: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, marginBottom: SIZES.xs },
  greeting: { fontSize: SIZES.fontSize.xs, color: COLORS.lightText, marginTop: SIZES.xs },
  cartIcon: {
    width: 40, height: 40, borderRadius: SIZES.borderRadius.md,
    backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center',
    position: 'relative' as any,
  },
  cartText: { fontSize: 20 },
  cartBadge: {
    position: 'absolute' as any, top: -5, right: -5,
    backgroundColor: COLORS.primary, borderRadius: SIZES.borderRadius.full,
    width: 20, height: 20, justifyContent: 'center', alignItems: 'center',
  },
  cartBadgeText: { color: COLORS.white, fontSize: SIZES.fontSize.xs, fontWeight: 'bold' },
  title: { fontSize: SIZES.fontSize['2xl'], fontWeight: '700', color: COLORS.text, marginBottom: SIZES.lg },
  searchBar: { marginBottom: SIZES.lg },
  searchInput: {
    borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.borderRadius.lg,
    paddingVertical: SIZES.md, paddingHorizontal: SIZES.lg,
    fontSize: SIZES.fontSize.sm, color: COLORS.text, backgroundColor: COLORS.lightGray,
  },
  columnWrapper: { justifyContent: 'space-between' },
  banner: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.xl, marginVertical: SIZES.xl, elevation: 3,
  },
  bannerLabel: { fontSize: SIZES.fontSize.xs, fontWeight: '600', color: COLORS.white, marginBottom: SIZES.sm, opacity: 0.9 },
  bannerText: { fontSize: SIZES.fontSize.xl, fontWeight: '700', color: COLORS.white, marginBottom: SIZES.md },
  bannerButton: { alignSelf: 'flex-start', marginTop: SIZES.md },
  bannerButtonText: { color: COLORS.white, fontWeight: '700', fontSize: SIZES.fontSize.sm },
  trendingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.sm, marginTop: SIZES.lg },
  trendingTitle: { fontSize: SIZES.fontSize.lg, fontWeight: '700', color: COLORS.text },
  seeAllLink: { fontSize: SIZES.fontSize.sm, color: COLORS.primary, fontWeight: '600' },
  gestureHint: { fontSize: 11, color: COLORS.lightText, textAlign: 'center', marginBottom: SIZES.lg, fontStyle: 'italic' },
});
