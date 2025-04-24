
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useWebLN from '@/hooks/useWebLN';
import { Check, X, Wallet } from 'lucide-react';

const WebLNStatus = () => {
  const { status, initWebLN, getInfo, info } = useWebLN();

  useEffect(() => {
    if (status.connected) {
      getInfo();
    }
  }, [status.connected, getInfo]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet size={20} />
          WebLN Status
        </CardTitle>
        <CardDescription>
          Connection status of your Lightning wallet
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">WebLN Available:</span>
            <span className="flex items-center">
              {status.enabled ? (
                <Check className="h-5 w-5 text-green-500 mr-1" />
              ) : (
                <X className="h-5 w-5 text-red-500 mr-1" />
              )}
              {status.enabled ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connected:</span>
            <span className="flex items-center">
              {status.connected ? (
                <Check className="h-5 w-5 text-green-500 mr-1" />
              ) : (
                <X className="h-5 w-5 text-red-500 mr-1" />
              )}
              {status.connected ? 'Yes' : 'No'}
            </span>
          </div>
          
          {status.provider && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Provider:</span>
              <span>{status.provider}</span>
            </div>
          )}
          
          {info?.node?.alias && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Node Alias:</span>
              <span>{info.node.alias}</span>
            </div>
          )}
          
          {info?.node?.pubkey && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pubkey:</span>
              <span className="text-xs truncate max-w-[200px]">{info.node.pubkey}</span>
            </div>
          )}
          
          {!status.connected && (
            <Button 
              className="w-full mt-4 bg-lightning-primary hover:bg-lightning-secondary"
              onClick={initWebLN}
            >
              Connect WebLN
            </Button>
          )}
          
          {status.error && (
            <div className="text-sm text-red-500 mt-2">{status.error}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WebLNStatus;