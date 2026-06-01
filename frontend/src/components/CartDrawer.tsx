import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../utils/formatters';

const CartDrawer: React.FC = () => {
  const { isOpen, items, setCartOpen, removeItem, updateQuantity, subtotal, total, promoDiscount, promoCode } =
    useCartStore();
  const sub = subtotal();
  const tot = total();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[70]"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#181818] z-[80] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#c5a880]" />
                <h2 className="font-serif text-lg font-semibold text-gray-900 dark:text-white">
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <span className="text-xs text-gray-400">({items.length} items)</span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 scrollbar-thin">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-gray-200 dark:text-gray-700" />
                  <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="btn-outline text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4"
                  >
                    <Link
                      to={`/products/${item.product.id}`}
                      onClick={() => setCartOpen(false)}
                      className="shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover bg-gray-100 dark:bg-[#1e1e1e]"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.product.id}`}
                        onClick={() => setCartOpen(false)}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-[#c5a880] transition-colors line-clamp-2 leading-tight"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Size: {item.selectedSize}
                      </p>
                      <p className="text-sm font-semibold text-[#c5a880] mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#c5a880] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.quantity + 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#c5a880] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.selectedSize)
                          }
                          className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-5 space-y-3">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Promo: {promoCode}</span>
                    <span>-{promoDiscount}%</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-[#c5a880]">{formatPrice(tot)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="btn-primary w-full justify-center gap-2"
                >
                  Checkout <ArrowRight size={16} />
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setCartOpen(false)}
                  className="btn-outline w-full justify-center text-xs"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
