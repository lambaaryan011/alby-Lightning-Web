
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QrCode, Copy } from 'lucide-react';
import useWebLN, { WebLNInvoice } from '@/hooks/useWebLN';
import { toast } from "@/components/ui/use-toast";
import CurrencyConverter from './CurrencyConverter';
import { QRCodeSVG } from 'qrcode.react'; // Changed from default import to named import

const MakeInvoice = () => {
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<WebLNInvoice | null>(null);
  const { makeInvoice, status, initWebLN } = useWebLN();
  
  const handleMakeInvoice = async () => {
    if (amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount",
      });
      return;
    }
    
    if (!status.connected) {
      try {
        await initWebLN();
      } catch (error) {
        return;
      }
    }
    
    setLoading(true);
    try {
      const result = await makeInvoice(amount, memo);
      if (result) {
        setInvoice(result);
        toast({
          title: "Invoice Created",
          description: "Lightning invoice generated successfully",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Invoice Creation Failed",
        description: error.message || "Failed to create invoice",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (invoice?.paymentRequest) {
      navigator.clipboard.writeText(invoice.paymentRequest);
      toast({
        title: "Copied!",
        description: "Invoice copied to clipboard",
      });
    }
  };
  
  const handleAmountChange = (value: number) => {
    setAmount(value);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Create Invoice</CardTitle>
        <CardDescription>
          Generate a Lightning invoice to receive payment
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!invoice ? (
          <div className="space-y-4">
            <CurrencyConverter 
              amount={amount}
              onAmountChange={handleAmountChange}
              disabled={loading}
            />
            
            <div className="space-y-2">
              <Label htmlFor="memo">Description (optional)</Label>
              <Textarea
                id="memo"
                placeholder="What's this payment for?"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                disabled={loading}
                className="lightning-input resize-none"
              />
            </div>
            
            <Button
              onClick={handleMakeInvoice}
              className="w-full bg-lightning-primary hover:bg-lightning-secondary"
              disabled={amount <= 0 || loading}
            >
              {loading ? 'Generating...' : 'Create Invoice'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center py-2">
              <div className="bg-white p-2 rounded-lg">
                {invoice.paymentRequest && (
                  <QRCodeSVG 
                    value={invoice.paymentRequest} 
                    size={128}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="L"
                    includeMargin={true}
                  />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoice">Lightning Invoice</Label>
              <div className="relative">
                <Textarea
                  id="invoice"
                  value={invoice.paymentRequest}
                  readOnly
                  className="lightning-input resize-none pr-10"
                  rows={4}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Amount:</span>
              <span className="font-semibold">{amount} sats</span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setInvoice(null)}
              className="w-full"
            >
              Create Another Invoice
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MakeInvoice;