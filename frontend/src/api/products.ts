import type { Product } from '../utils/types';

// High-quality Unsplash fashion images
const PRODUCT_IMAGES = {
  suit1: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&q=80',
  ],
  suit2: [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
  ],
  shirt1: [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
    'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80',
  ],
  shirt2: [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    'https://images.unsplash.com/photo-1618354691321-3d0a40a22c76?w=800&q=80',
  ],
  coat1: [
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=800&q=80',
  ],
  coat2: [
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
  ],
  casual1: [
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80',
  ],
  casual2: [
    'https://images.unsplash.com/photo-1561136594-7f68813d8842?w=800&q=80',
    'https://images.unsplash.com/photo-1625910513594-4660f5bde8f4?w=800&q=80',
  ],
  trouser1: [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
  ],
  accessory1: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    'https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=800&q=80',
  ],
};

export const mockProducts: Product[] = [
  {
    id: 'p001',
    name: 'Midnight Navy Wool Suit',
    price: 899,
    originalPrice: 1200,
    category: 'Suits',
    description:
      'Crafted from premium 120s wool, this midnight navy suit offers a slim silhouette perfect for boardrooms and black-tie occasions alike. Features a half-canvas construction and hand-stitched lapels.',
    images: PRODUCT_IMAGES.suit1,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.9,
    reviewCount: 124,
    inStock: true,
    isFeatured: true,
    isNew: false,
    tags: ['formal', 'wool', 'slim-fit'],
  },
  {
    id: 'p002',
    name: 'Charcoal Pinstripe Suit',
    price: 1150,
    category: 'Suits',
    description:
      'A commanding charcoal pinstripe suit tailored in Italian Super 130s wool. The subtle stripe adds depth and character to any executive wardrobe.',
    images: PRODUCT_IMAGES.suit2,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.7,
    reviewCount: 88,
    inStock: true,
    isFeatured: true,
    isNew: true,
    tags: ['formal', 'pinstripe', 'italian'],
  },
  {
    id: 'p003',
    name: 'Egyptian Cotton Oxford Shirt',
    price: 185,
    originalPrice: 240,
    category: 'Shirts',
    description:
      'Woven from the finest Egyptian long-staple cotton, this Oxford shirt delivers a crisp, breathable feel. Perfect for formal or smart-casual settings.',
    images: PRODUCT_IMAGES.shirt1,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    reviewCount: 217,
    inStock: true,
    isFeatured: true,
    isNew: false,
    tags: ['shirt', 'cotton', 'oxford'],
  },
  {
    id: 'p004',
    name: 'Slim Fit French Tuck Shirt',
    price: 145,
    category: 'Shirts',
    description:
      'A modern slim-fit shirt in luxurious poplin cotton. Pre-treated for wrinkle resistance—always presentation-ready, straight from the wardrobe.',
    images: PRODUCT_IMAGES.shirt2,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviewCount: 143,
    inStock: true,
    isFeatured: false,
    isNew: true,
    tags: ['slim-fit', 'poplin', 'versatile'],
  },
  {
    id: 'p005',
    name: 'Cashmere Overcoat',
    price: 1450,
    originalPrice: 1800,
    category: 'Outerwear',
    description:
      'Pure Mongolian cashmere in a double-breasted cut. Timelessly elegant with a refined drape that elevates any outfit beneath it.',
    images: PRODUCT_IMAGES.coat1,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 5.0,
    reviewCount: 56,
    inStock: true,
    isFeatured: true,
    isNew: false,
    tags: ['cashmere', 'luxury', 'winter'],
  },
  {
    id: 'p006',
    name: 'Wool-Blend Trench Coat',
    price: 875,
    category: 'Outerwear',
    description:
      'A heritage-inspired trench coat in a wool-polyester blend. Water-resistant finish, belted waist, and storm flap — built for the modern urban gentleman.',
    images: PRODUCT_IMAGES.coat2,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.7,
    reviewCount: 91,
    inStock: true,
    isFeatured: false,
    isNew: true,
    tags: ['trench', 'wool', 'waterproof'],
  },
  {
    id: 'p007',
    name: 'Premium Merino Crew Sweater',
    price: 295,
    originalPrice: 380,
    category: 'Casual',
    description:
      'Super-fine Merino wool in a classic crew-neck silhouette. Breathable, itch-free, and perfect for layering across seasons.',
    images: PRODUCT_IMAGES.casual1,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    reviewCount: 178,
    inStock: true,
    isFeatured: true,
    isNew: false,
    tags: ['merino', 'sweater', 'casual'],
  },
  {
    id: 'p008',
    name: 'Luxe Cotton Polo',
    price: 165,
    category: 'Casual',
    description:
      'A refined take on the classic polo, crafted from Pima cotton with a mother-of-pearl button placket. Smart casual at its finest.',
    images: PRODUCT_IMAGES.casual2,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.5,
    reviewCount: 132,
    inStock: true,
    isFeatured: false,
    isNew: true,
    tags: ['polo', 'pima-cotton', 'smart-casual'],
  },
  {
    id: 'p009',
    name: 'Tailored Slim Wool Trousers',
    price: 325,
    originalPrice: 420,
    category: 'Trousers',
    description:
      'Precision-tailored slim trousers in a year-round wool blend. Features a flat-front design, side adjusters, and a clean break hem.',
    images: PRODUCT_IMAGES.trouser1,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.7,
    reviewCount: 95,
    inStock: true,
    isFeatured: true,
    isNew: false,
    tags: ['trousers', 'wool', 'tailored'],
  },
  {
    id: 'p010',
    name: 'Italian Leather Belt',
    price: 195,
    category: 'Accessories',
    description:
      'Full-grain Italian calf leather with a brushed gold buckle. Hand-burnished edges and a classic taper for a refined finish.',
    images: PRODUCT_IMAGES.accessory1,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewCount: 207,
    inStock: true,
    isFeatured: false,
    isNew: false,
    tags: ['leather', 'belt', 'accessories'],
  },
  {
    id: 'p011',
    name: 'Double-Breasted Blazer',
    price: 650,
    originalPrice: 850,
    category: 'Suits',
    description:
      'A bold double-breasted blazer cut from stretch virgin wool. Peak lapels and gold-tone buttons give it a statement-making character.',
    images: PRODUCT_IMAGES.suit1,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.6,
    reviewCount: 74,
    inStock: true,
    isFeatured: false,
    isNew: true,
    tags: ['blazer', 'double-breasted', 'formal'],
  },
  {
    id: 'p012',
    name: 'Silk-Cotton Dress Shirt',
    price: 220,
    category: 'Shirts',
    description:
      'A silk-cotton blend shirt with a self-stripe pattern. The semi-structured collar and hidden placket give it an understated luxury feel.',
    images: PRODUCT_IMAGES.shirt1,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    reviewCount: 162,
    inStock: false,
    isFeatured: false,
    isNew: false,
    tags: ['silk', 'dress-shirt', 'formal'],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export const getProducts = async (): Promise<Product[]> => {
  await delay(400);
  return mockProducts;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  await delay(300);
  return mockProducts.find((p) => p.id === id) ?? null;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  await delay(300);
  return mockProducts.filter((p) => p.isFeatured);
};

export const getNewArrivals = async (): Promise<Product[]> => {
  await delay(300);
  return mockProducts.filter((p) => p.isNew);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  await delay(500);
  const newProduct: Product = { ...product, id: `p${Date.now()}` };
  mockProducts.push(newProduct);
  return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  await delay(500);
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Product not found');
  mockProducts[index] = { ...mockProducts[index], ...updates };
  return mockProducts[index];
};

export const deleteProduct = async (id: string): Promise<void> => {
  await delay(400);
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index !== -1) mockProducts.splice(index, 1);
};
