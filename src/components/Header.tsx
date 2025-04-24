
import { useState } from 'react';
import useWebLN from '@/hooks/useWebLN';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Wallet, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {
  const { status, initWebLN } = useWebLN();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-bold bg-lightning-gradient bg-clip-text text-transparent">
              Lightning Web App
            </h1>
            <p className="text-xs text-muted-foreground">
              Powered by WebLN
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className={cn("rounded-full", 
              darkMode ? "bg-muted text-primary" : "bg-secondary/10 text-secondary"
            )}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className="rounded-full bg-secondary/10 text-secondary"
          >
            <Info size={18} />
          </Button>
          
          {!status.connected && (
            <Button
              onClick={initWebLN}
              className="bg-lightning-primary hover:bg-lightning-secondary text-white"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
      
      {isInfoOpen && (
        <div className="container mt-4 p-4 rounded-lg bg-muted text-sm">
          <p className="mb-2"><strong>About WebLN:</strong> WebLN is a set of specifications for Lightning apps and client providers to facilitate communication between web apps and users' Lightning nodes.</p>
          <p><strong>Get Started:</strong> Install Alby browser extension or use a WebLN-compatible wallet to interact with this app.</p>
        </div>
      )}
    </header>
  );
};

export default Header;