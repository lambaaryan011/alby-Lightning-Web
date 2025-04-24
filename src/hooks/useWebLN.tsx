
import { useState, useEffect, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    webln: any;
    WebLN: any;
    alby: any; // Add Alby extension support
  }
}

export interface WebLNStatus {
  enabled: boolean;
  connected: boolean;
  provider?: string;
  error?: string;
}

export interface WebLNInfo {
  node: {
    alias?: string;
    pubkey?: string;
  };
  methods?: string[];
  supports?: string[];
}

export interface WebLNInvoice {
  paymentRequest: string;
  paymentHash?: string;
  amount?: number;
}

export interface WebLNPaymentResponse {
  preimage: string;
}

const useWebLN = () => {
  const [webln, setWebLN] = useState<any>(null);
  const [status, setStatus] = useState<WebLNStatus>({
    enabled: false,
    connected: false,
  });
  const [info, setInfo] = useState<WebLNInfo | null>(null);
  
  // Function to check if WebLN is available
  const checkWebLNAvailability = useCallback(() => {
    if (typeof window !== 'undefined' && (window.webln || window.alby)) {
      setStatus(prev => ({
        ...prev,
        enabled: true
      }));
      return true;
    } else {
      console.log("WebLN not detected in the browser");
      setStatus({
        enabled: false,
        connected: false,
        error: 'WebLN not available. Install Alby or another WebLN provider.'
      });
      return false;
    }
  }, []);
  
  // Initialize WebLN connection
  const initWebLN = useCallback(async () => {
    try {
      // Check if WebLN is available in the browser
      const isAvailable = checkWebLNAvailability();
      if (!isAvailable) {
        // Redirect to Alby extension page if WebLN is not available
        const installAlby = window.confirm("WebLN is not available in your browser. Would you like to install the Alby extension?");
        if (installAlby) {
          window.open("https://getalby.com", "_blank");
        }
        return false;
      }
      
      // Try to access WebLN
      let weblnProvider;
      
      if (window.webln) {
        weblnProvider = window.webln;
      } else if (window.alby) {
        weblnProvider = window.alby;
      }
      
      if (weblnProvider) {
        // Connect to the provider
        await weblnProvider.enable();
        
        setWebLN(weblnProvider);
        setStatus({
          enabled: true,
          connected: true,
          provider: weblnProvider.provider || 'Unknown'
        });
        
        toast({
          title: "WebLN Connected",
          description: `Connected to ${weblnProvider.provider || 'Lightning wallet'}`,
        });
        
        return true;
      } else {
        throw new Error('No WebLN provider found after checking availability');
      }
    } catch (error: any) {
      console.error("WebLN init error:", error);
      setStatus({
        enabled: typeof window !== 'undefined' && (window.webln || window.alby) ? true : false,
        connected: false,
        error: error.message || 'Failed to connect to WebLN'
      });
      
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error.message || 'Failed to connect to WebLN',
      });
      
      return false;
    }
  }, [checkWebLNAvailability]);

  // Get WebLN provider info
  const getInfo = useCallback(async () => {
    try {
      if (!webln) {
        const connected = await initWebLN();
        if (!connected) return null;
      }
      
      const response = await webln.getInfo();
      setInfo(response);
      return response;
    } catch (error: any) {
      console.error("WebLN getInfo error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to get wallet info',
      });
      return null;
    }
  }, [webln, initWebLN]);

  // Make an invoice
  const makeInvoice = useCallback(async (amount: number, defaultMemo?: string) => {
    try {
      if (!webln) {
        const connected = await initWebLN();
        if (!connected) return null;
      }
      
      const response = await webln.makeInvoice({
        amount,
        defaultMemo: defaultMemo || `Invoice for ${amount} sats`,
      });
      
      toast({
        title: "Invoice Created",
        description: "Lightning invoice generated successfully",
      });
      
      return response;
    } catch (error: any) {
      console.error("WebLN makeInvoice error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to create invoice',
      });
      return null;
    }
  }, [webln, initWebLN]);

  // Send payment
  const sendPayment = useCallback(async (paymentRequest: string) => {
    try {
      if (!webln) {
        const connected = await initWebLN();
        if (!connected) return null;
      }
      
      const response = await webln.sendPayment(paymentRequest);
      
      toast({
        title: "Payment Sent",
        description: "Lightning payment successful!",
      });
      
      return response;
    } catch (error: any) {
      console.error("WebLN sendPayment error:", error);
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || 'Failed to send payment',
      });
      return null;
    }
  }, [webln, initWebLN]);

  // Keysend payment
  const keysend = useCallback(async (destination: string, amount: number, customKey?: string, customValue?: string) => {
    try {
      if (!webln) {
        const connected = await initWebLN();
        if (!connected) return null;
      }
      
      if (!webln.keysend) {
        throw new Error('Your wallet does not support keysend payments');
      }
      
      const keysendArgs: any = { destination, amount };
      
      if (customKey && customValue) {
        keysendArgs.customRecords = {
          [customKey]: customValue
        };
      }
      
      const response = await webln.keysend(keysendArgs);
      
      toast({
        title: "Keysend Payment Sent",
        description: `Successfully sent ${amount} sats!`,
      });
      
      return response;
    } catch (error: any) {
      console.error("WebLN keysend error:", error);
      toast({
        variant: "destructive",
        title: "Keysend Failed",
        description: error.message || 'Failed to send keysend payment',
      });
      return null;
    }
  }, [webln, initWebLN]);

  // Request payment via LN Address and amount
  const payViaAddress = useCallback(async (lnAddress: string, amount: number) => {
    try {
      if (!webln) {
        const connected = await initWebLN();
        if (!connected) return null;
      }
      
      // First we need to send a LNURL-pay request to the LN address
      // This is a simplified implementation
      // In a production app, we would use proper LNURL libraries
      
      const [name, domain] = lnAddress.split('@');
      if (!name || !domain) {
        throw new Error('Invalid Lightning Address format');
      }
      
      // Fetch the LNURL-pay endpoint
      const response = await fetch(`https://${domain}/.well-known/lnurlp/${name}`);
      if (!response.ok) {
        throw new Error(`Failed to resolve Lightning Address: ${response.statusText}`);
      }
      
      const lnurlData = await response.json();
      
      if (!lnurlData || lnurlData.status === 'ERROR') {
        throw new Error(lnurlData.reason || 'Failed to resolve Lightning Address');
      }
      
      // Request an invoice with the specified amount
      const callback = lnurlData.callback;
      const invoiceResponse = await fetch(`${callback}?amount=${amount * 1000}`); // Convert to millisats
      if (!invoiceResponse.ok) {
        throw new Error(`Failed to get invoice: ${invoiceResponse.statusText}`);
      }
      
      const invoiceData = await invoiceResponse.json();
      
      if (!invoiceData || invoiceData.status === 'ERROR') {
        throw new Error(invoiceData.reason || 'Failed to get invoice from Lightning Address');
      }
      
      // Send the payment using the invoice
      return await sendPayment(invoiceData.pr);
    } catch (error: any) {
      console.error("LN Address payment error:", error);
      toast({
        variant: "destructive",
        title: "LN Address Payment Failed",
        description: error.message || 'Failed to pay Lightning Address',
      });
      return null;
    }
  }, [webln, initWebLN, sendPayment]);

  // Effect to check WebLN on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkWebLNAvailability();
    }
  }, [checkWebLNAvailability]);

  return {
    webln,
    status,
    info,
    initWebLN,
    getInfo,
    makeInvoice,
    sendPayment,
    keysend,
    payViaAddress,
  };
};

export default useWebLN;