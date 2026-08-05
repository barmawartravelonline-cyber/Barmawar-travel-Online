export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AED' | 'SAR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateFromUSD: number;
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'USD - US Dollar', rateFromUSD: 1.0, flag: '🇺🇸' },
  INR: { code: 'INR', symbol: '₹', name: 'INR - Indian Rupee', rateFromUSD: 83.5, flag: '🇮🇳' },
  EUR: { code: 'EUR', symbol: '€', name: 'EUR - Euro', rateFromUSD: 0.92, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'GBP - British Pound', rateFromUSD: 0.78, flag: '🇬🇧' },
  AED: { code: 'AED', symbol: 'AED ', name: 'AED - UAE Dirham', rateFromUSD: 3.67, flag: '🇦🇪' },
  SAR: { code: 'SAR', symbol: 'SAR ', name: 'SAR - Saudi Riyal', rateFromUSD: 3.75, flag: '🇸🇦' },
};

/**
 * Converts a USD base price to the target currency and formats it with appropriate symbols and thousand separators.
 */
export function formatCurrencyPrice(priceInUSD: number, targetCurrency: CurrencyCode = 'USD'): {
  amount: number;
  formatted: string;
  symbol: string;
  code: CurrencyCode;
} {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.USD;
  const convertedAmount = Math.round(priceInUSD * config.rateFromUSD);
  const formattedNumber = convertedAmount.toLocaleString('en-US');

  return {
    amount: convertedAmount,
    formatted: `${config.symbol}${formattedNumber}`,
    symbol: config.symbol,
    code: config.code,
  };
}
