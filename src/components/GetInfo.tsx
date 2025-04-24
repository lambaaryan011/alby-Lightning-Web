
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useWebLN, { WebLNInfo } from '@/hooks/useWebLN';
import { RefreshCw, Info } from 'lucide-react';

const GetInfo = () => {
  const [loading, setLoading] = useState(false);
  const { getInfo, status, info } = useWebLN();
  
  const handleGetInfo = async () => {
    setLoading(true);
    try {
      await getInfo();
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (status.connected && !info) {
      handleGetInfo();
    }
  }, [status.connected, info]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info size={20} />
          Wallet Info
        </CardTitle>
        <CardDescription>
          Get information about your Lightning wallet
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {info ? (
          <div className="space-y-3">
            {info.node?.alias && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Node Alias:</span>
                <span>{info.node.alias}</span>
              </div>
            )}
            
            {info.node?.pubkey && (
              <div>
                <span className="text-sm font-medium block mb-1">Pubkey:</span>
                <code className="bg-muted p-2 rounded text-xs block overflow-auto">
                  {info.node.pubkey}
                </code>
              </div>
            )}
            
            {info.methods && info.methods.length > 0 && (
              <div>
                <span className="text-sm font-medium block mb-1">Supported Methods:</span>
                <div className="flex flex-wrap gap-1">
                  {info.methods.map((method) => (
                    <span 
                      key={method} 
                      className="text-xs bg-accent px-2 py-1 rounded-full"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {info.supports && info.supports.length > 0 && (
              <div>
                <span className="text-sm font-medium block mb-1">Features:</span>
                <div className="flex flex-wrap gap-1">
                  {info.supports.map((feature) => (
                    <span 
                      key={feature} 
                      className="text-xs bg-accent px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : status.connected ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No information available</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Connect your wallet to see information</p>
          </div>
        )}
      </CardContent>
      
      {status.connected && (
        <CardFooter className="pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetInfo}
            disabled={loading}
            className="flex items-center w-full"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Info'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default GetInfo;