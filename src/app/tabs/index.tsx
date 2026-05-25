import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { STRINGS } from '@/constants/strings';
import { CategoryBar, ProductCard } from '@/components';
import { CATEGORIES } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchProductsRequest } from '@/redux/products/productSagaActions';
import { setSelectedCategory as setSelectedCategoryRedux } from '@/redux/products/productSlice';

export default function Home() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { products, loading, selectedCategory } = useAppSelector(state => state.products);
  const cartTotal = useAppSelector(state => state.cart.totalItems);
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <SafeAreaView style={styles.container}>
      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => router.push({
                pathname: '/product/[id]',
                params: { id: item.id }
              } as any)}
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
                <TouchableOpacity
                  style={styles.cartIcon}
                  onPress={() => router.push('/cart' as any)}
                >
                  <Text style={styles.cartText}>🛒</Text>
                  {cartTotal > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{cartTotal}</Text>
                    </View>
                  )}
                </TouchableOpacity>
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
                categories={CATEGORIES}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: SIZES.screenPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  greeting: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
    marginTop: SIZES.xs,
  },
  cartIcon: {
    width: 40,
    height: 40,
    borderRadius: SIZES.borderRadius.md,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative' as any,
  },
  cartText: {
    fontSize: 20,
  },
  cartBadge: {
    position: 'absolute' as any,
    top: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius.full,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: SIZES.fontSize.xs,
    fontWeight: 'bold',
  },
  title: {
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.lg,
  },
  searchBar: {
    marginBottom: SIZES.lg,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.lg,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    fontSize: SIZES.fontSize.sm,
    color: COLORS.text,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.lg,
    marginVertical: SIZES.xl,
    justifyContent: 'center',
  },
  bannerLabel: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: SIZES.sm,
  },
  bannerText: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.md,
  },
  bannerButton: {
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  trendingTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllLink: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
