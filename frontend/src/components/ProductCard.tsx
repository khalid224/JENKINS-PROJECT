import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../utils/types';
import { formatPrice, formatDiscount } from '../utils/formatters';
import { useCartStore } from '../store/useCartStore';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0]);
    setCartOpen(true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((w) => !w);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link to={`/products/${product.id}`} className="group block">
        <div
          className="relative overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] aspect-[3/4]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Main Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              hovered && product.images[1] ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {/* Hover Image */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="badge text-xs px-2 py-1 bg-[#121212] text-white tracking-widest uppercase">
                New
              </span>
            )}
            {product.originalPrice && (
              <span className="badge text-xs px-2 py-1 bg-[#c5a880] tracking-widest uppercase">
                -{formatDiscount(product.originalPrice, product.price)}%
              </span>
            )}
            {!product.inStock && (
              <span className="badge text-xs px-2 py-1 bg-gray-500 tracking-widest uppercase">
                Sold Out
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 flex items-center justify-center bg-white dark:bg-[#1e1e1e] shadow-md transition-all duration-200 hover:scale-110 ${
                wishlisted ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <Link
              to={`/products/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 flex items-center justify-center bg-white dark:bg-[#1e1e1e] shadow-md text-gray-600 dark:text-gray-300 hover:text-[#c5a880] transition-all duration-200 hover:scale-110"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </Link>
          </div>

          {/* Add to Cart overlay */}
          <div
            className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
              hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full py-3.5 bg-[#121212] dark:bg-white text-white dark:text-[#121212] text-xs font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#c5a880] dark:hover:bg-[#c5a880] dark:hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={14} />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {product.category}
          </p>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-[#c5a880] transition-colors duration-200 leading-tight">
            {product.name}
          </h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <div className="flex items-center gap-2">
            <span className="price-tag">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
