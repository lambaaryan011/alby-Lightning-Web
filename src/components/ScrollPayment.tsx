
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import useWebLN from '@/hooks/useWebLN';
import { Progress } from "@/components/ui/progress";
import { formatNumber } from '@/utils/currencyUtils';

const ScrollPayment = () => {
  const [enabled, setEnabled] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastPayTime, setLastPayTime] = useState(0);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const { keysend, status } = useWebLN();
  
  // This is the node pubkey that will receive scroll payments
  // In a real app, this should be configurable
  const RECIPIENT_PUBKEY = "03e7156ae33b0a208d0744199163177e909e80176e55d97a2f221ede0f934dd9ad";
  
  useEffect(() => {
    // Throttle scroll events to prevent excessive payments
    const throttleDelay = 2000; // 2 seconds between payments
    
    // Setup scroll listener
    const handleScroll = async () => {
      if (!enabled || !status.connected || isProcessing) return;
      
      const now = Date.now();
      if (now - lastPayTime < throttleDelay) return;
      
      setIsProcessing(true);
      try {
        // Make a 1 sat payment on scroll
        const result = await keysend(RECIPIENT_PUBKEY, 1);
        if (result) {
          setScrollCount(prev => prev + 1);
          setTotalPaid(prev => prev + 1);
          setLastPayTime(Date.now());
        }
      } catch (error) {
        console.error("Scroll payment error:", error);
      } finally {
        // Add a cooldown period before allowing more scroll payments
        if (cooldownRef.current) {
          clearTimeout(cooldownRef.current);
        }
        
        cooldownRef.current = setTimeout(() => {
          setIsProcessing(false);
        }, throttleDelay);
      }
    };
    
    if (enabled) {
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current);
      }
    };
  }, [enabled, status.connected, isProcessing, lastPayTime, keysend]);
  
  // Reset scroll count every minute to show recent activity
  useEffect(() => {
    const intervalId = setInterval(() => {
      setScrollCount(0);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Auto-Payment on Scroll</CardTitle>
        <CardDescription>
          Send 1 sat every time you scroll on the page
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="scroll-payment">Enable Scroll Payments</Label>
              <p className="text-xs text-muted-foreground">
                Pay 1 sat per scroll event
              </p>
            </div>
            <Switch
              id="scroll-payment"
              checked={enabled}
              onCheckedChange={setEnabled}
              disabled={!status.connected}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Recent Scrolls:</span>
              <span>{scrollCount}</span>
            </div>
            <Progress value={scrollCount} max={10} className="h-2" />
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Total Paid:</span>
            <span className="font-semibold">{formatNumber(totalPaid)} sats</span>
          </div>
          
          {isProcessing && (
            <div className="text-xs text-muted-foreground text-center animate-pulse">
              Processing payment...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScrollPayment;