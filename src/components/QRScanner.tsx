
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, QrCode } from 'lucide-react';
import useWebLN from '@/hooks/useWebLN';
import { isValidLightningInvoice } from '@/utils/webln';
import { toast } from "@/components/ui/use-toast";
import { QrReader } from 'react-qr-reader';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const { sendPayment, status, initWebLN } = useWebLN();
  const [loading, setLoading] = useState(false);
  
  const handleScan = (result: any) => {
    if (result?.text) {
      setScannedData(result.text);
      setScanning(false);
      
      toast({
        title: "QR Code Scanned",
        description: "Lightning invoice detected",
      });
    }
  };
  
  const handlePayScannedInvoice = async () => {
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
    
    if (!isValidLightningInvoice(scannedData)) {
      toast({
        variant: "destructive",
        title: "Invalid Invoice",
        description: "The scanned QR code is not a valid Lightning invoice",
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await sendPayment(scannedData);
      if (result) {
        toast({
          title: "Payment Successful",
          description: "Your lightning payment was sent successfully!",
        });
        setScannedData('');
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
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <QrCode size={20} />
          QR Scanner
        </CardTitle>
        <CardDescription>
          Scan Lightning invoice QR codes to pay
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {!scannedData ? (
            <>
              {scanning ? (
                <div className="h-48 overflow-hidden rounded-lg">
                  <QrReader
                    onResult={handleScan}
                    constraints={{ facingMode: 'environment' }}
                    containerStyle={{ width: '100%', height: '100%' }}
                    videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    videoContainerStyle={{ width: '100%', height: '100%' }}
                  />
                </div>
              ) : (
                <div 
                  className="h-48 border-2 border-dashed rounded-lg flex items-center justify-center border-border"
                >
                  <div className="text-center">
                    <QrCode className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click below to scan a QR code</p>
                  </div>
                </div>
              )}
              
              <Button
                onClick={() => setScanning(!scanning)}
                className="w-full bg-lightning-primary hover:bg-lightning-secondary"
              >
                {scanning ? 'Cancel Scanning' : 'Scan QR Code'}
              </Button>
            </>
          ) : (
            <>
              <div className="p-3 bg-muted rounded-lg overflow-hidden">
                <p className="text-xs break-all">
                  <span className="font-semibold block mb-1">Scanned Invoice:</span>
                  {scannedData.substring(0, 30)}...
                </p>
              </div>
              
              <Button
                onClick={handlePayScannedInvoice}
                className="w-full bg-lightning-primary hover:bg-lightning-secondary"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay Invoice'} 
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setScannedData('')}
                className="w-full"
              >
                Scan Another QR Code
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QRScanner;