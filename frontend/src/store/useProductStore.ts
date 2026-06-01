import { create } from 'zustand';
import type { Product, FilterState, ProductCategory, SortOption } from '../utils/types';
import { getProducts } from '../api/products';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: FilterState;

  fetchProducts: () => Promise<void>;
  setSearchQuery: (q: string) => void;
  setCategories: (cats: ProductCategory[]) => void;
  toggleCategory: (cat: ProductCategory) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: SortOption) => void;
  setInStock: (val: boolean) => void;
  resetFilters: () => void;

  // Admin actions
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;

  // Computed
  filteredProducts: () => Product[];
}

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [0, 2000],
  sizes: [],
  inStock: false,
  sortBy: 'featured',
  searchQuery: '',
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  filters: { ...defaultFilters },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await getProducts();
      set({ products, loading: false });
    } catch {
      set({ error: 'Failed to load products', loading: false });
    }
  },

  setSearchQuery: (q) =>
    set((state) => ({ filters: { ...state.filters, searchQuery: q } })),

  setCategories: (cats) =>
    set((state) => ({ filters: { ...state.filters, categories: cats } })),

  toggleCategory: (cat) =>
    set((state) => {
      const cats = state.filters.categories;
      return {
        filters: {
          ...state.filters,
          categories: cats.includes(cat)
            ? cats.filter((c) => c !== cat)
            : [...cats, cat],
        },
      };
    }),

  setPriceRange: (range) =>
    set((state) => ({ filters: { ...state.filters, priceRange: range } })),

  setSortBy: (sort) =>
    set((state) => ({ filters: { ...state.filters, sortBy: sort } })),

  setInStock: (val) =>
    set((state) => ({ filters: { ...state.filters, inStock: val } })),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  filteredProducts: () => {
    const { products, filters } = get();
    let result = [...products];

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    result = result.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.inStock) {
      result = result.filter((p) => p.inStock);
    }

    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  },
}));
