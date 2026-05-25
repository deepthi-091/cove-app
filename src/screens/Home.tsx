import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, SIZES, STRINGS } from '../constants';
import { CategoryBar, ProductCard } from '../components';
import { CATEGORIES, PRODUCTS } from '../data/mockData';

export const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts =
    selectedCategory === '1'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === CATEGORIES.find((c) => c.id === selectedCategory)?.name);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.logo}>C</Text>
              <TouchableOpacity style={styles.cartIcon}>
                <Text style={styles.cartText}>❤️</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>{STRINGS.home_discover}</Text>

            <View style={styles.searchBar}>
              <TextInput
                placeholder={STRINGS.home_search}
                placeholderTextColor={COLORS.lightText}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <CategoryBar
              categories={CATEGORIES}
              selectedId={selectedCategory}
              onSelectCategory={setSelectedCategory}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  cartIcon: {
    width: 40,
    height: 40,
    borderRadius: SIZES.borderRadius.md,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartText: {
    fontSize: 20,
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
