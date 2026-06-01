import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, Share2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../utils/formatters';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import type { Product } from '../utils/types';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, fetchProducts } = useProductStore();
  const { addItem, setCartOpen } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  useEffect(() => {
    const found = products.find((p) => p.id === id) ?? null;
    setProduct(found);
    setSelectedSize('');
    setActiveImage(0);
    setAdded(false);
  }, [id, products]);

  const related = products
    .filter((p) => p.id !== id && p.category === product?.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    if (product) {
      addItem(product, selectedSize, quantity);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        setCartOpen(true);
      }, 1000);
    }
  };

  if (!product && products.length > 0) {
    return (
      <div className="pt-32 text-center min-h-screen">
        <p className="text-gray-500">Product not found.</p>
        <button onClick={() => navigate('/products')} className="btn-primary mt-4">
          Back to Shop
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/3" />
            <div className="h-8 bg-gray-200 dark:bg-gray-800 w-2/3" />
            <div className="h-6 bg-gray-200 dark:bg-gray-800 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#c5a880] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#c5a880] transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-[#c5a880] transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* ─── IMAGE GALLERY ─── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]}
                  alt={`${product.name} image ${activeImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => Math.max(0, i - 1))}
                    disabled={activeImage === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 dark:bg-black/60 disabled:opacity-30 hover:bg-[#c5a880] hover:text-white transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => Math.min(product.images.length - 1, i + 1))}
                    disabled={activeImage === product.images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 dark:bg-black/60 disabled:opacity-30 hover:bg-[#c5a880] hover:text-white transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <span className="badge">New</span>}
                {!product.inStock && <span className="badge bg-gray-500">Sold Out</span>}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-24 overflow-hidden border-2 transition-colors ${
                      i === activeImage
                        ? 'border-[#c5a880]'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── PRODUCT INFO ─── */}
          <div className="lg:pt-4">
            <p className="section-subtitle mb-3">{product.category}</p>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 dark:text-white leading-tight mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-5">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} size={16} />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-[#c5a880]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                  Select Size
                </h3>
                <button className="text-xs text-[#c5a880] underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`w-12 h-12 text-sm font-medium border transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-[#c5a880] bg-[#c5a880] text-white'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#c5a880]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="text-red-400 text-xs mt-2">Please select a size to continue.</p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                Qty
              </span>
              <div className="flex items-center border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#c5a880] transition-colors"
                >
                  -
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-gray-900 dark:text-white font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#c5a880] transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 btn-primary justify-center py-4 text-sm ${
                  added ? 'bg-green-600 hover:bg-green-600' : ''
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>
              <button
                onClick={() => setWishlisted((w) => !w)}
                className={`w-14 flex items-center justify-center border transition-colors duration-200 ${
                  wishlisted
                    ? 'border-red-400 text-red-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-[#c5a880] hover:text-[#c5a880]'
                }`}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <button className="w-14 flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-[#c5a880] hover:text-[#c5a880] transition-colors">
                <Share2 size={18} />
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Features */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-2.5">
              {[
                '✓ Free shipping on orders over $300',
                '✓ 30-day easy returns',
                '✓ Authentic premium craftsmanship',
                '✓ Secure payment processing',
              ].map((f) => (
                <p key={f} className="text-sm text-gray-500 dark:text-gray-400">
                  {f}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-100 dark:border-gray-800">
            <div className="mb-8">
              <p className="section-subtitle mb-2">More Like This</p>
              <h2 className="section-title">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#c5a880] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
