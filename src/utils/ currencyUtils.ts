
// Exchange rates for different fiat currencies to BTC
// These should be updated via an API in a production app
const EXCHANGE_RATES = {
    USD: 0.000023, // 1 USD = 0.000023 BTC (example rate)
    EUR: 0.000025, // 1 EUR = 0.000025 BTC
    GBP: 0.000029, // 1 GBP = 0.000029 BTC
    JPY: 0.00000016, // 1 JPY = 0.00000016 BTC
  };
  
  // 1 BTC = 100,000,000 sats
  const SATS_PER_BTC = 100000000;
  
  /**
   * Convert fiat amount to satoshis
   * @param amount - Amount in fiat currency
   * @param currency - Fiat currency code (USD, EUR, etc.)
   * @returns Number of satoshis
   */
  export const fiatToSats = (amount: number, currency: keyof typeof EXCHANGE_RATES = 'USD'): number => {
    if (!EXCHANGE_RATES[currency]) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
    
    const btcAmount = amount * EXCHANGE_RATES[currency];
    const satsAmount = Math.round(btcAmount * SATS_PER_BTC);
    
    return satsAmount;
  };
  
  /**
   * Convert satoshis to fiat amount
   * @param sats - Amount in satoshis
   * @param currency - Fiat currency code (USD, EUR, etc.)
   * @returns Amount in specified fiat currency
   */
  export const satsToFiat = (sats: number, currency: keyof typeof EXCHANGE_RATES = 'USD'): number => {
    if (!EXCHANGE_RATES[currency]) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
    
    const btcAmount = sats / SATS_PER_BTC;
    const fiatAmount = btcAmount / EXCHANGE_RATES[currency];
    
    return parseFloat(fiatAmount.toFixed(2));
  };
  
  /**
   * Format number with commas for thousands
   * @param num - Number to format
   * @returns Formatted number string
   */
  export const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  /**
   * Format currency amount with symbol
   * @param amount - Amount to format
   * @param currency - Currency code
   * @returns Formatted currency string
   */
  export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    const symbols: {[key: string]: string} = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
    };
    
    const symbol = symbols[currency] || '';
    const formatted = formatNumber(parseFloat(amount.toFixed(2)));
    
    return `${symbol}${formatted}`;
  };
  
  /**
   * Get list of supported fiat currencies
   * @returns Array of currency codes
   */
  export const getSupportedCurrencies = (): string[] => {
    return Object.keys(EXCHANGE_RATES);
  };