
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import WebLNStatus from '@/components/WebLNStatus';
import SendPayment from '@/components/SendPayment';
import Keysend from '@/components/Keysend';
import GetInfo from '@/components/GetInfo';
import MakeInvoice from '@/components/MakeInvoice';
import ScrollPayment from '@/components/ScrollPayment';
import QRScanner from '@/components/QRScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidLightningAddress } from '@/utils/webln';
import useWebLN from '@/hooks/useWebLN';
import { ArrowRight } from 'lucide-react';
import CurrencyConverter from '@/components/CurrencyConverter';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [lnAddress, setLnAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { payViaAddress, status, initWebLN } = useWebLN();
  
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };
  
  const handlePayViaAddress = async () => {
    if (!isValidLightningAddress(lnAddress)) {
      toast({
        variant: "destructive",
        title: "Invalid Address",
        description: 'Please enter a valid Lightning Address',
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
      const result = await payViaAddress(lnAddress, amount);
      if (result) {
        toast({
          title: "Payment Sent",
          description: `Successfully paid ${amount} sats to ${lnAddress}!`,
        });
        setAmount(0);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || 'Failed to send payment to Lightning Address',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAmountChange = (value: number) => {
    setAmount(value);
  };
  
  const createDummyContent = () => {
    const content = [];
    for (let i = 0; i < 20; i++) {
      content.push(
        <div key={i} className="h-20 my-4 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Scroll content {i + 1}</p>
        </div>
      );
    }
    return content;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container py-8">
        <section className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-3">
            <span className="bg-lightning-gradient bg-clip-text text-transparent">
              WebLN Lightning Application
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A demonstration app showing the capabilities of WebLN. 
            Connect your Lightning wallet to explore all the features.
          </p>
        </section>
        
        <section className="mb-8">
          <WebLNStatus />
        </section>
        
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Core WebLN Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SendPayment />
            <MakeInvoice />
            <Keysend />
            <GetInfo />
            <QRScanner />
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pay Lightning Address</CardTitle>
                <CardDescription>
                  Send payment to a Lightning Address
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lnAddress">Lightning Address</Label>
                    <Input
                      id="lnAddress"
                      placeholder="user@domain.com"
                      value={lnAddress}
                      onChange={(e) => setLnAddress(e.target.value)}
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
                    onClick={handlePayViaAddress}
                    className="w-full bg-lightning-primary hover:bg-lightning-secondary"
                    disabled={!lnAddress || amount <= 0 || loading}
                  >
                    {loading ? 'Processing...' : 'Pay Address'}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-4">Scroll-to-Pay Feature</h3>
          
          <div className="mb-6">
            <ScrollPayment />
          </div>
          
          <div className="border-2 border-dashed border-muted rounded-lg p-6 overflow-y-auto max-h-[400px]">
            <div className="text-center mb-6">
              <h4 className="font-semibold">Scroll Down To Pay Area</h4>
              <p className="text-sm text-muted-foreground">
                When enabled, scrolling in this area will send 1 sat per scroll event
              </p>
            </div>
            
            {createDummyContent()}
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Lightning Web Application Demo</p>
          <p className="mt-1">Built with WebLN for Lightning Network integration</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;