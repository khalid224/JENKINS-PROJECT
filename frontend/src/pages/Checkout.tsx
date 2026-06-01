import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../utils/formatters';
import { processCheckout } from '../api/cart';
import type { CheckoutFormData } from '../utils/types';

const STEPS = ['Shipping', 'Payment', 'Review'];

const initialForm: CheckoutFormData = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', state: '', zipCode: '', country: '',
  cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '',
};

const Checkout: React.FC = () => {
  const { items, subtotal, total, clearCart, promoDiscount, promoCode } = useCartStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CheckoutFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState('');

  const sub = subtotal();
  const tot = total();
  const shipping = sub > 300 ? 0 : 25;
  const grandTotal = tot + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const formatCard = (val: string) =>
    val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  const formatExpiry = (val: string) =>
    val.replace(/\D/g, '').replace(/^(.{2})(.+)/, '$1/$2').slice(0, 5);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const result = await processCheckout({
        items,
        total: grandTotal,
        customerInfo: { ...form },
      });
      setOrderId(result.orderId);
      setOrderDate(result.estimatedDelivery);
      clearCart();
      setStep(3); // success
    } finally {
      setLoading(false);
    }
  };

  // Order success screen
  if (step === 3) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-2">Order ID: <strong className="text-[#c5a880]">{orderId}</strong></p>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Estimated delivery by <strong>{orderDate}</strong>
          </p>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Thank you for your order! A confirmation email has been sent. Your items will be expertly packaged and shipped soon.
          </p>
          <Link to="/products" className="btn-primary">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="section-subtitle mb-2">Secure</p>
          <h1 className="section-title">Checkout</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  i === step
                    ? 'text-[#c5a880]'
                    : i < step
                    ? 'text-gray-500 dark:text-gray-400 cursor-pointer hover:text-[#c5a880]'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < step
                      ? 'bg-[#c5a880] text-white'
                      : i === step
                      ? 'border-2 border-[#c5a880] text-[#c5a880]'
                      : 'border-2 border-gray-200 dark:border-gray-700 text-gray-400'
                  }`}
                >
                  {i < step ? <Check size={12} /> : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-10 ${i < step ? 'bg-[#c5a880]' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* STEP 0 — Shipping */}
              {step === 0 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-4">Shipping Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'firstName', label: 'First Name', placeholder: 'John' },
                      { name: 'lastName', label: 'Last Name', placeholder: 'Smith' },
                    ].map(({ name, label, placeholder }) => (
                      <div key={name}>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
                        <input name={name} value={(form as any)[name]} onChange={handleChange} placeholder={placeholder} className="input-field" />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
                      { name: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', type: 'tel' },
                    ].map(({ name, label, placeholder, type }) => (
                      <div key={name}>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
                        <input type={type} name={name} value={(form as any)[name]} onChange={handleChange} placeholder={placeholder} className="input-field" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Street Address</label>
                    <input name="address" value={form.address} onChange={handleChange} placeholder="123 Fashion Ave" className="input-field" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { name: 'city', label: 'City', placeholder: 'New York' },
                      { name: 'state', label: 'State', placeholder: 'NY' },
                      { name: 'zipCode', label: 'ZIP Code', placeholder: '10001' },
                    ].map(({ name, label, placeholder }) => (
                      <div key={name}>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
                        <input name={name} value={(form as any)[name]} onChange={handleChange} placeholder={placeholder} className="input-field" />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} className="btn-primary w-full justify-center mt-2">
                    Continue to Payment <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {/* STEP 1 — Payment */}
              {step === 1 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Lock size={16} className="text-[#c5a880]" />
                    <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white">Payment Details</h2>
                    <span className="text-xs text-gray-400 ml-auto">256-bit SSL Encrypted</span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Cardholder Name</label>
                    <input name="cardName" value={form.cardName} onChange={handleChange} placeholder="John Smith" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Card Number</label>
                    <input
                      name="cardNumber"
                      value={form.cardNumber}
                      onChange={(e) => setForm((f) => ({ ...f, cardNumber: formatCard(e.target.value) }))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="input-field font-mono tracking-widest"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Expiry Date</label>
                      <input
                        name="cardExpiry"
                        value={form.cardExpiry}
                        onChange={(e) => setForm((f) => ({ ...f, cardExpiry: formatExpiry(e.target.value) }))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">CVV</label>
                      <input
                        name="cardCvv"
                        value={form.cardCvv}
                        onChange={(e) => setForm((f) => ({ ...f, cardCvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="•••"
                        maxLength={4}
                        className="input-field"
                        type="password"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="btn-outline flex-1 justify-center">← Back</button>
                    <button onClick={() => setStep(2)} className="btn-primary flex-1 justify-center">
                      Review Order <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Review */}
              {step === 2 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-4">Review Your Order</h2>
                  
                  {/* Shipping Summary */}
                  <div className="border border-gray-100 dark:border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Shipping To</h3>
                      <button onClick={() => setStep(0)} className="text-xs text-[#c5a880] hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {form.firstName} {form.lastName} · {form.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {form.address}, {form.city}, {form.state} {form.zipCode}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="border border-gray-100 dark:border-gray-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Payment</h3>
                      <button onClick={() => setStep(1)} className="text-xs text-[#c5a880] hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {form.cardName} · ···· {form.cardNumber.slice(-4)}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-16 object-cover bg-gray-100 dark:bg-gray-800" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                          <p className="text-xs text-gray-400">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#c5a880]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">← Back</button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="btn-primary flex-1 justify-center"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Processing…
                        </span>
                      ) : (
                        <>Place Order · {formatPrice(grandTotal)} <Lock size={14} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
              <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto scrollbar-thin">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                      {item.product.name} ×{item.quantity}
                    </span>
                    <span className="text-gray-900 dark:text-white shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span><span>{formatPrice(sub)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>{promoCode} (-{promoDiscount}%)</span>
                    <span>-{formatPrice(tot - sub)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-500">Free</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-[#c5a880]">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
