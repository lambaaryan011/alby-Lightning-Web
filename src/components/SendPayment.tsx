
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidLightningInvoice } from '@/utils/webln';
import useWebLN from '@/hooks/useWebLN';
import { ArrowRight } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const SendPayment = () => {
  const [invoice, setInvoice] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendPayment, status, initWebLN } = useWebLN();
  
  const handleSendPayment = async () => {
    if (!status.connected) {
      try {
        await initWebLN();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Failed to connect to WebLN. Please ensure you have a WebLN provider installed.",
        });
        return;
      }
    }
    
    if (!isValidLightningInvoice(invoice)) {
      toast({
        variant: "destructive",
        title: "Invalid Invoice",
        description: "Please enter a valid Lightning invoice",
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await sendPayment(invoice);
      if (result) {
        toast({
          title: "Payment Successful",
          description: "Your lightning payment was sent successfully!",
        });
        setInvoice('');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || "Something went wrong with the payment",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && isValidLightningInvoice(text)) {
        setInvoice(text);
      } else if (text) {
        toast({
          variant: "destructive",
          title: "Invalid Invoice",
          description: "The copied text is not a valid Lightning invoice",
        });
      }
    } catch (error) {
      console.error("Failed to read clipboard", error);
      toast({
        variant: "destructive",
        title: "Clipboard Access Failed",
        description: "Unable to access clipboard. Please paste the invoice manually.",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Send Payment</CardTitle>
        <CardDescription>
          Pay a Lightning invoice
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoice">Lightning Invoice</Label>
            <div className="flex gap-2">
              <Input
                id="invoice"
                placeholder="lnbc..."
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                disabled={loading}
                className="lightning-input flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handlePaste}
                title="Paste from clipboard"
              >
                📋
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleSendPayment}
            className="w-full bg-lightning-primary hover:bg-lightning-secondary"
            disabled={!invoice || loading}
          >
            {loading ? 'Processing...' : 'Pay Invoice'}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SendPayment;