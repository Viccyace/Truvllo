import { CurrencyCode } from '@/types';
import { formatCurrency } from '@/lib/utils/currency';

export const premiumPrices: Record<CurrencyCode, { amount: number; interval: string }> = {
  NGN: { amount: 6500,  interval: 'month' },
  USD: { amount: 7,     interval: 'month' },
  EUR: { amount: 7,     interval: 'month' },
  GBP: { amount: 6,     interval: 'month' },
  KES: { amount: 900,   interval: 'month' },
  GHS: { amount: 90,    interval: 'month' },
};

export function formatPrice(amount: number, currency: CurrencyCode): string {
  return formatCurrency(amount, currency);
}
