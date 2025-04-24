import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidNodePubkey } from '@/utils/webln';
import useWebLN from '@/hooks/useWebLN';
import { ArrowRight } from 'lucide-react';
import CurrencyConverter from './CurrencyConverter';
import { toast } from "@/components/ui/use-toast";

const Keysend = () => {
  const [pubkey, setPubkey] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { keysend, status, initWebLN } = useWebLN();
  
  const handleKeysend = async () => {
    if (!isValidNodePubkey(pubkey)) {
      toast({
        variant: "destructive",
        title: "Invalid Pubkey",
        description: 'Please enter a valid Lightning node pubkey',
      });
      return;
    }
    
    if (amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: 'Please enter a valid amount',
      });
      return;
    }

    // Initialize WebLN if not connected
    if (!status.connected) {
      try {
        await initWebLN();
      } catch (error) {
        return;
      }
    }
    
    setLoading(true);
    try {
      const result = await keysend(pubkey, amount);
      if (result) {
        toast({
          title: "Payment Sent",
          description: `Successfully sent ${amount} sats!`,
        });
        // Keep the pubkey but reset amount after successful payment
        setAmount(0);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || 'Failed to send keysend payment',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAmountChange = (value: number) => {
    setAmount(value);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Keysend Payment</CardTitle>
        <CardDescription>
          Send a direct keysend payment to a Lightning node
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pubkey">Node Pubkey</Label>
            <Input
              id="pubkey"
              placeholder="03a7..."
              value={pubkey}
              onChange={(e) => setPubkey(e.target.value)}
              disabled={loading}
              className="lightning-input"
            />
          </div>
          
          <CurrencyConverter 
            amount={amount}
            onAmountChange={handleAmountChange}
            disabled={loading}
          />
          
          <Button
            onClick={handleKeysend}
            className="w-full bg-lightning-primary hover:bg-lightning-secondary"
            disabled={!pubkey || amount <= 0 || loading}
          >
            {loading ? 'Processing...' : 'Send Keysend'}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Keysend;