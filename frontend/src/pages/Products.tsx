import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '../store/useProductStore';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, SIZES, SORT_OPTIONS } from '../utils/constants';
import type { ProductCategory, SortOption } from '../utils/types';

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const {
    products,
    loading,
    filters,
    fetchProducts,
    setSearchQuery,
    toggleCategory,
    setPriceRange,
    setSortBy,
    setInStock,
    resetFilters,
    filteredProducts,
  } = useProductStore();

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  // Sync URL params into filter state
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category') as ProductCategory | null;
    if (q) setSearchQuery(q);
    if (cat && CATEGORIES.includes(cat as ProductCategory)) {
      useProductStore.getState().setCategories([cat as ProductCategory]);
    }
  }, [searchParams]);

  const results = filteredProducts();

  return (
    <div className="pt-20 min-h-screen">
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-[#161616] border-b border-gray-200 dark:border-gray-800 py-10 text-center">
        <p className="section-subtitle mb-2">Browse</p>
        <h1 className="section-title">Our Collection</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          {results.length} {results.length === 1 ? 'piece' : 'pieces'} found
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products…"
              value={filters.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 py-2.5 text-sm"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="input-field py-2.5 pr-8 text-sm appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Filters toggle (mobile) */}
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="flex items-center gap-2 btn-outline py-2.5 text-sm"
            >
              <SlidersHorizontal size={15} /> Filters
              {(filters.categories.length > 0 || filters.inStock) && (
                <span className="w-4 h-4 flex items-center justify-center bg-[#c5a880] text-white text-[9px] rounded-full">
                  {filters.categories.length + (filters.inStock ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Reset */}
            {(filters.categories.length > 0 ||
              filters.inStock ||
              filters.searchQuery ||
              filters.priceRange[0] > 0 ||
              filters.priceRange[1] < 2000) && (
              <button
                onClick={resetFilters}
                className="text-xs text-gray-400 hover:text-red-400 underline transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 overflow-hidden"
              >
                <div className="w-60 space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-widest uppercase mb-3">
                      Category
                    </h3>
                    <div className="space-y-2">
                      {CATEGORIES.map((cat) => (
                        <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(cat as ProductCategory)}
                            onChange={() => toggleCategory(cat as ProductCategory)}
                            className="w-4 h-4 accent-[#c5a880] cursor-pointer"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#c5a880] transition-colors">
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-widest uppercase mb-3">
                      Price Range
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min={0}
                        max={2000}
                        step={50}
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([filters.priceRange[0], Number(e.target.value)])
                        }
                        className="w-full accent-[#c5a880]"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* In Stock */}
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4 accent-[#c5a880]"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">In Stock Only</span>
                  </label>

                  {/* Sizes */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-widest uppercase mb-3">
                      Size
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          className="w-10 h-10 text-xs border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#c5a880] hover:text-[#c5a880] transition-colors"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-800" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-800 w-1/2" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-gray-400 text-lg">No products match your filters.</p>
                <button onClick={resetFilters} className="btn-outline mt-4 text-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {results.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
