import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product, Category } from '@/types';

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
}

const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  categories: [],
  loading: false,
  error: null,
  selectedCategory: 'all',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setProducts, setSelectedProduct, setCategories, setLoading, setError, setSelectedCategory } = productSlice.actions;
export default productSlice.reducer;
