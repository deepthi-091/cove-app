import axios from 'axios';
import { DUMMY_JSON_BASE_URL, PRODUCT_ENDPOINTS } from '@/constants/api';
import type { Product, Category } from '@/types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  statusCode: number;
}

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  images: string[];
  rating: number;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  category: string;
  discountPercentage?: number;
  stock?: number;
  [key: string]: any;
}

interface DummyJsonCategory {
  slug: string;
  name: string;
  url?: string;
}

const dummyJsonAxios = axios.create({
  baseURL: DUMMY_JSON_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const mapDummyJsonProduct = (product: DummyJsonProduct): Product => {
  return {
    id: product.id.toString(),
    name: product.title,
    price: product.price,
    image: product.thumbnail,
    category: product.category,
    rating: product.rating,
    reviews: product.reviews?.length || 0,
    description: product.description,
    onSale: (product.discountPercentage ?? 0) > 0,
    salePercentage: product.discountPercentage || 0,
  };
};

export const fetchProducts = async (): Promise<ApiResponse<Product[]>> => {
  try {
    const response = await dummyJsonAxios.get(PRODUCT_ENDPOINTS.PRODUCTS);
    const products = response.data.products.map(mapDummyJsonProduct);
    return {
      success: true,
      data: products,
      message: 'Products fetched successfully',
      statusCode: 200,
    };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch products',
      statusCode: error.response?.status || 500,
    };
  }
};

export const fetchProductById = async (id: string): Promise<ApiResponse<Product>> => {
  try {
    const response = await dummyJsonAxios.get(PRODUCT_ENDPOINTS.PRODUCT_BY_ID(id));
    const product = mapDummyJsonProduct(response.data);
    return {
      success: true,
      data: product,
      message: 'Product fetched successfully',
      statusCode: 200,
    };
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return {
      success: false,
      message: error.response?.status === 404 ? 'Product not found' : 'Failed to fetch product',
      statusCode: error.response?.status || 500,
    };
  }
};

export const searchProducts = async (query: string): Promise<ApiResponse<Product[]>> => {
  try {
    const response = await dummyJsonAxios.get(PRODUCT_ENDPOINTS.PRODUCTS_SEARCH(query));
    const products = response.data.products.map(mapDummyJsonProduct);
    return {
      success: true,
      data: products,
      message: 'Search completed',
      statusCode: 200,
    };
  } catch (error: any) {
    console.error('Error searching products:', error);
    return {
      success: false,
      message: 'Search failed',
      statusCode: error.response?.status || 500,
    };
  }
};

export const fetchByCategory = async (category: string): Promise<ApiResponse<Product[]>> => {
  if (category === 'all' || category === '1') {
    return fetchProducts();
  }
  try {
    const response = await dummyJsonAxios.get(PRODUCT_ENDPOINTS.PRODUCTS_BY_CATEGORY(category));
    const products = response.data.products.map(mapDummyJsonProduct);
    return {
      success: true,
      data: products,
      message: 'Category products fetched',
      statusCode: 200,
    };
  } catch (error: any) {
    console.error('Error fetching category products:', error);
    return {
      success: false,
      message: 'Failed to fetch category products',
      statusCode: error.response?.status || 500,
    };
  }
};

export const fetchCategories = async (): Promise<ApiResponse<Category[]>> => {
  try {
    const response = await dummyJsonAxios.get(PRODUCT_ENDPOINTS.PRODUCT_CATEGORIES);
    const categories: Category[] = [
      { id: 'all', name: 'All' },
      ...response.data.map((cat: DummyJsonCategory) => ({
        id: cat.slug,
        name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
      })),
    ];
    return {
      success: true,
      data: categories,
      message: 'Categories fetched',
      statusCode: 200,
    };
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      message: 'Failed to fetch categories',
      statusCode: error.response?.status || 500,
    };
  }
};
