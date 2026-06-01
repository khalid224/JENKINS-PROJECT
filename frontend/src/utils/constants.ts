export const CATEGORIES = [
  'Suits',
  'Shirts',
  'Outerwear',
  'Casual',
  'Accessories',
  'Trousers',
] as const;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
];

export const MAX_PRICE = 2000;
export const MIN_PRICE = 0;

export const BRAND_NAME = 'TX Men Wear';
export const BRAND_TAGLINE = 'Dress With Intention';
