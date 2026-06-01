import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../utils/formatters';
import { validatePromoCode } from '../api/cart';

const Cart: React.FC = () => {
  const {
    items, removeItem, updateQuantity, clearCart,
    subtotal, discountAmount, total, promoDiscount, promoCode,
    applyPromo, clearPromo,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMsg, setPromoMsg] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);

  const sub = subtotal();
  const disc = discountAmount();
  const tot = total();
  const shipping = sub > 300 ? 0 : 25;

  const handlePromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoMsg('');
    try {
      const res = await validatePromoCode(promoInput);
      setPromoMsg(res.message);
      setPromoSuccess(res.valid);
      if (res.valid) applyPromo(res.discount, promoInput.toUpperCase());
    } finally {
      setPromoLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-5 px-4">
        <ShoppingBag size={64} className="text-gray-200 dark:text-gray-800" />
        <h1 className="font-serif text-3xl text-gray-900 dark:text-white">Your Cart is Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          Looks like you haven't added anything yet. Explore our curated collection.
        </p>
        <Link to="/products" className="btn-primary">
          Shop Now <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="section-subtitle mb-2">Review</p>
          <h1 className="section-title">Shopping Cart</h1>
          <p className="text-gray-400 text-sm mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header row */}
            <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-widest pb-3 border-b border-gray-100 dark:border-gray-800">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedSize}`}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-12 gap-4 items-center py-5 border-b border-gray-100 dark:border-gray-800"
                >
                  {/* Product */}
                  <div className="col-span-12 md:col-span-6 flex gap-4">
                    <Link to={`/products/${item.product.id}`} className="shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-24 md:w-24 md:h-28 object-cover bg-gray-100 dark:bg-gray-800"
                      />
                    </Link>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{item.product.category}</p>
                        <Link
                          to={`/products/${item.product.id}`}
                          className="text-sm font-medium text-gray-900 dark:text-white hover:text-[#c5a880] transition-colors leading-tight mt-0.5 block"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-1">Size: {item.selectedSize}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedSize)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors w-fit mt-2"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-4 md:col-span-2 text-center">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {formatPrice(item.product.price)}
                    </span>
                  </div>

                  {/* Qty */}
                  <div className="col-span-4 md:col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#c5a880] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#c5a880] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="col-span-4 md:col-span-2 text-right">
                    <span className="text-sm font-semibold text-[#c5a880]">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-2">
              <Link to="/products" className="text-sm text-gray-400 hover:text-[#c5a880] transition-colors flex items-center gap-1">
                ← Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
              <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              {/* Promo Code */}
              <div className="mb-5">
                {promoDiscount > 0 ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {promoCode} (-{promoDiscount}%)
                      </span>
                    </div>
                    <button onClick={() => { clearPromo(); setPromoMsg(''); setPromoInput(''); }}>
                      <X size={14} className="text-green-400 hover:text-red-400 transition-colors" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handlePromo()}
                      className="input-field text-sm py-2.5 flex-1"
                    />
                    <button
                      onClick={handlePromo}
                      disabled={promoLoading}
                      className="btn-outline py-2.5 px-4 text-xs shrink-0"
                    >
                      {promoLoading ? '…' : 'Apply'}
                    </button>
                  </div>
                )}
                {promoMsg && (
                  <p className={`text-xs mt-1.5 ${promoSuccess ? 'text-green-500' : 'text-red-400'}`}>
                    {promoMsg}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1.5">Try: TXMEN20, LUXURY15, WELCOME10</p>
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                {disc > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Discount</span>
                    <span>-{formatPrice(disc)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-500">Free</span> : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-semibold text-gray-900 dark:text-white text-base">
                  <span>Total</span>
                  <span className="text-[#c5a880] text-xl">{formatPrice(tot + shipping)}</span>
                </div>
              </div>

              {sub < 300 && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Add {formatPrice(300 - sub)} more for free shipping
                </p>
              )}

              <Link to="/checkout" className="btn-primary w-full justify-center mt-6">
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <div className="flex items-center justify-center gap-4 mt-4">
                {['visa', 'mastercard', 'amex', 'paypal'].map((card) => (
                  <span key={card} className="text-xs text-gray-300 dark:text-gray-600 font-medium uppercase tracking-wider">
                    {card}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
