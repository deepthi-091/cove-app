export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  colors?: string[];
  sizes?: string[];
  description?: string;
  onSale?: boolean;
  salePercentage?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  orders: number;
  reviews: number;
  purchases: number;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  text: string;
  images?: string[];
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}
