export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  description: string;
  images: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  tags: string[];
}

export type ProductCategory =
  | 'Suits'
  | 'Shirts'
  | 'Outerwear'
  | 'Casual'
  | 'Accessories'
  | 'Trousers';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
}

export interface FilterState {
  categories: ProductCategory[];
  priceRange: [number, number];
  sizes: string[];
  inStock: boolean;
  sortBy: SortOption;
  searchQuery: string;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'rating';

export interface AdminProductForm {
  name: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  description: string;
  sizes: string[];
  inStock: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  tags: string[];
}
