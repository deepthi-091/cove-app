import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { ProductCard } from '@/components';
import { api } from '@/utils/api';
import type { Product } from '@/types';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setSearched(true);
      try {
        const data = await api.searchProducts(query);
        setResults(data);
      } catch (error) {
        console.error('Error searching:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search linen, ceramic, cedar..."
          placeholderTextColor={COLORS.lightText}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      {searched && results.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      )}

      {!searched && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Start typing to search</Text>
        </View>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
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
          scrollEventThrottle={16}
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
  header: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
  },
  searchBar: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.lg,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    fontSize: SIZES.fontSize.base,
    color: COLORS.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.fontSize.base,
    color: COLORS.lightText,
  },
  listContent: {
    paddingHorizontal: SIZES.screenPadding,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
