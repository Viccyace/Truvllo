import { CurrencyCode } from '@/types';

const SYMBOLS: Record<CurrencyCode, string> = {
  NGN: '₦',
  USD: '$',
  EUR: '€',
  GBP: '£',
  KES: 'KSh ',
  GHS: '₵',
};

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const symbol   = SYMBOLS[currency];
  const decimals = ['NGN', 'KES', 'GHS'].includes(currency) ? 0 : 2;
  const number   = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
  return `${symbol}${number}`;
}

export function formatPrice(amount: number, currency: CurrencyCode): string {
  return formatCurrency(amount, currency);
}
