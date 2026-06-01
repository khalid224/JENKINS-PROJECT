import type { CartItem } from '../utils/types';

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export interface CheckoutPayload {
  items: CartItem[];
  total: number;
  customerInfo: Record<string, string>;
}

export interface OrderResult {
  orderId: string;
  status: 'success' | 'failed';
  message: string;
  estimatedDelivery: string;
}

export const processCheckout = async (
  _payload: CheckoutPayload
): Promise<OrderResult> => {
  await delay(1500);
  // Mock always succeeds
  const orderId = `TXM-${Date.now().toString(36).toUpperCase()}`;
  return {
    orderId,
    status: 'success',
    message: 'Your order has been placed successfully!',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  };
};

export const validatePromoCode = async (
  code: string
): Promise<{ valid: boolean; discount: number; message: string }> => {
  await delay(600);
  const codes: Record<string, number> = {
    TXMEN20: 20,
    LUXURY15: 15,
    WELCOME10: 10,
  };
  const upper = code.toUpperCase();
  if (codes[upper]) {
    return {
      valid: true,
      discount: codes[upper],
      message: `Promo code applied! ${codes[upper]}% off your order.`,
    };
  }
  return { valid: false, discount: 0, message: 'Invalid promo code.' };
};
