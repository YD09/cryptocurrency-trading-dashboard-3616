import { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StockSuggestion {
  symbol: string;
  name: string;
  type: 'equity' | 'index' | 'commodity';
  exchange: string;
}

interface StockSearchBarProps {
  onSymbolSelect: (symbol: string) => void;
}

const StockSearchBar = ({ onSymbolSelect }: StockSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock Indian stock data - in real app, this would come from API
  const stockData: StockSuggestion[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', type: 'equity', exchange: 'NSE' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', type: 'equity', exchange: 'NSE' },
    { symbol: 'INFY', name: 'Infosys Limited', type: 'equity', exchange: 'NSE' },
    { symbol: 'HDFC', name: 'HDFC Bank Limited', type: 'equity', exchange: 'NSE' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', type: 'equity', exchange: 'NSE' },
    { symbol: 'NIFTY50', name: 'Nifty 50', type: 'index', exchange: 'NSE' },
    { symbol: 'BANKNIFTY', name: 'Bank Nifty', type: 'index', exchange: 'NSE' },
    { symbol: 'SENSEX', name: 'BSE Sensex', type: 'index', exchange: 'BSE' },
    { symbol: 'GOLD', name: 'Gold', type: 'commodity', exchange: 'MCX' },
    { symbol: 'SILVER', name: 'Silver', type: 'commodity', exchange: 'MCX' },
    { symbol: 'CRUDE', name: 'Crude Oil', type: 'commodity', exchange: 'MCX' },
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = stockData.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (suggestion: StockSuggestion) => {
    setQuery(suggestion.symbol);
    setShowSuggestions(false);
    onSymbolSelect(suggestion.symbol);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'equity':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'index':
        return <BarChart3 className="h-4 w-4 text-primary" />;
      case 'commodity':
        return <div className="h-4 w-4 rounded-full bg-warning" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search stocks, indices, commodities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
          className="pl-10 pr-4 bg-secondary/50 border-muted focus:border-primary"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-secondary border border-muted rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <Button
              key={`${suggestion.symbol}-${suggestion.exchange}`}
              variant="ghost"
              className={`w-full justify-start px-3 py-2 h-auto text-left hover:bg-muted/50 ${
                index === selectedIndex ? 'bg-muted/50' : ''
              }`}
              onClick={() => handleSelect(suggestion)}
            >
              <div className="flex items-center gap-3">
                {getTypeIcon(suggestion.type)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{suggestion.symbol}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {suggestion.name}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {suggestion.exchange}
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockSearchBar;