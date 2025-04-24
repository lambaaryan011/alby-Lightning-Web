
/**
 * Check if a string is a valid Lightning invoice
 * @param invoice - The string to check
 * @returns Boolean indicating if the string is a valid invoice
 */
export const isValidLightningInvoice = (invoice: string): boolean => {
    // Basic check for Lightning invoice format
    // More sophisticated validation would need a proper library
    return /^(lnbc|lntb|lnbcrt)[0-9][a-z0-9]{5,}$/i.test(invoice);
  };
  
  /**
   * Check if a string is a valid Lightning Address
   * @param address - The string to check
   * @returns Boolean indicating if the string is a valid Lightning Address
   */
  export const isValidLightningAddress = (address: string): boolean => {
    // Lightning addresses are formatted like email addresses
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(address);
  };
  
  /**
   * Check if a string is a valid Lightning node pubkey
   * @param pubkey - The string to check
   * @returns Boolean indicating if the string is a valid pubkey
   */
  export const isValidNodePubkey = (pubkey: string): boolean => {
    // Basic check for 66-character hex string
    return /^[0-9a-f]{66}$/i.test(pubkey);
  };
  
  /**
   * Parse a LNURL or Lightning Address
   * @param str - LNURL or Lightning Address string
   * @returns Processed LNURL or null if invalid
   */
  export const parseLightningIdentifier = (str: string): string | null => {
    if (!str) return null;
  
    // Handle Lightning Address
    if (isValidLightningAddress(str)) {
      return str;
    }
    
    // Handle LNURL
    if (str.toLowerCase().startsWith('lnurl')) {
      // LNURL processing would go here
      // This is a simplified placeholder
      return str;
    }
    
    // Handle Lightning invoice
    if (isValidLightningInvoice(str)) {
      return str;
    }
  
    return null;
  };
  
  /**
   * Generate a random string for payment request memos
   * @param length - Length of the random string
   * @returns Random string
   */
  export const generateRandomString = (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  /**
   * Extract payment details from a Lightning invoice
   * @param paymentRequest - The Lightning invoice/payment request
   * @returns Object with decoded invoice details or null if invalid
   */
  export const decodeInvoice = (paymentRequest: string): {
    amount?: number;
    timestamp?: number;
    description?: string;
  } | null => {
    // This is a simplified placeholder
    // In a real app, you would use a proper Lightning invoice decoder library
    if (!isValidLightningInvoice(paymentRequest)) return null;
    
    return {
      amount: 0, // Would be extracted from the actual invoice
      timestamp: Date.now(),
      description: 'Payment request',
    };
  };