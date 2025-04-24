
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fiatToSats, satsToFiat, getSupportedCurrencies } from '@/utils/currencyUtils';

interface CurrencyConverterProps {
  amount: number;
  onAmountChange: (amount: number) => void;
  disabled?: boolean;
}

const CurrencyConverter = ({ amount, onAmountChange, disabled = false }: CurrencyConverterProps) => {
  const [inputMode, setInputMode] = useState<'sats' | 'fiat'>('sats');
  const [fiatAmount, setFiatAmount] = useState<string>('');
  const [satsAmount, setSatsAmount] = useState<string>(amount.toString());
  const [currency, setCurrency] = useState<string>('USD');
  const currencies = getSupportedCurrencies();

  // Update the fiat amount when sats or currency changes
  useEffect(() => {
    if (inputMode === 'sats' && satsAmount) {
      const fiat = satsToFiat(parseFloat(satsAmount) || 0, currency as any);
      setFiatAmount(fiat.toString());
    }
  }, [satsAmount, currency, inputMode]);

  // Update the sats amount when fiat or currency changes
  useEffect(() => {
    if (inputMode === 'fiat' && fiatAmount) {
      const sats = fiatToSats(parseFloat(fiatAmount) || 0, currency as any);
      setSatsAmount(sats.toString());
    }
  }, [fiatAmount, currency, inputMode]);

  // Sync with parent component
  useEffect(() => {
    if (amount !== parseFloat(satsAmount)) {
      setSatsAmount(amount.toString());
      const fiat = satsToFiat(amount, currency as any);
      setFiatAmount(fiat.toString());
    }
  }, [amount, currency]);

  const handleSatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSatsAmount(value);
    setInputMode('sats');
    
    const parsedValue = parseFloat(value) || 0;
    onAmountChange(parsedValue);
  };

  const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFiatAmount(value);
    setInputMode('fiat');
    
    const sats = fiatToSats(parseFloat(value) || 0, currency as any);
    setSatsAmount(sats.toString());
    onAmountChange(sats);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="satsAmount">Amount (sats)</Label>
        <Input
          id="satsAmount"
          type="number"
          min="0"
          placeholder="0"
          value={satsAmount}
          onChange={handleSatsChange}
          disabled={disabled}
          className="lightning-input"
        />
      </div>
      
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="fiatAmount">Fiat Equivalent</Label>
          <Input
            id="fiatAmount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={fiatAmount}
            onChange={handleFiatChange}
            disabled={disabled}
            className="lightning-input"
          />
        </div>
        
        <div className="w-24">
          <Select
            value={currency}
            onValueChange={setCurrency}
            disabled={disabled}
          >
            <SelectTrigger className="lightning-input">
              <SelectValue placeholder="USD" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {currencies.map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;