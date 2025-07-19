import { useState, useRef, useEffect } from 'react';
import { Search, TrendingUp, BarChart3, Bitcoin, DollarSign, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StockSuggestion {
  symbol: string;
  name: string;
  type: 'crypto' | 'forex' | 'commodity' | 'stock' | 'index';
  exchange: string;
  tradingViewSymbol: string;
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

  // Comprehensive market data including crypto, forex, commodities, and stocks
  const stockData: StockSuggestion[] = [
    // Cryptocurrencies
    { symbol: 'BTCUSD', name: 'Bitcoin', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:BTCUSDT' },
    { symbol: 'ETHUSD', name: 'Ethereum', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:ETHUSDT' },
    { symbol: 'BNBUSD', name: 'Binance Coin', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:BNBUSDT' },
    { symbol: 'ADAUSD', name: 'Cardano', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:ADAUSDT' },
    { symbol: 'SOLUSD', name: 'Solana', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:SOLUSDT' },
    { symbol: 'DOTUSD', name: 'Polkadot', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:DOTUSDT' },
    { symbol: 'MATICUSD', name: 'Polygon', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:MATICUSDT' },
    { symbol: 'LINKUSD', name: 'Chainlink', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:LINKUSDT' },
    { symbol: 'UNIUSD', name: 'Uniswap', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:UNIUSDT' },
    { symbol: 'AVAXUSD', name: 'Avalanche', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:AVAXUSDT' },
    { symbol: 'ATOMUSD', name: 'Cosmos', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:ATOMUSDT' },
    { symbol: 'LTCUSD', name: 'Litecoin', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:LTCUSDT' },
    { symbol: 'XRPUSD', name: 'Ripple', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:XRPUSDT' },
    { symbol: 'DOGEUSD', name: 'Dogecoin', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:DOGEUSDT' },
    { symbol: 'SHIBUSD', name: 'Shiba Inu', type: 'crypto', exchange: 'CRYPTO', tradingViewSymbol: 'BINANCE:SHIBUSDT' },
    
    // Forex Pairs
    { symbol: 'EURUSD', name: 'Euro vs US Dollar', type: 'forex', exchange: 'FOREX', tradingViewSymbol: 'FX:EURUSD' },
    { symbol: 'GBPUSD', name: 'British Pound vs US Dollar', type: 'forex', exchange: 'FOREX', tradingViewSymbol: 'FX:GBPUSD' },
    { symbol: 'USDJPY', name: 'US Dollar vs Japanese Yen', type: 'forex', exchange: 'FOREX', tradingViewSymbol: 'FX:USDJPY' },
    { symbol: 'USDCHF', name: 'US Dollar vs Swiss Franc', type: 'forex', exchange: 'FOREX', tradingViewSymbol: 'FX:USDCHF' },
    { symbol: 'AUDUSD', name: 'Australian Dollar vs US Dollar', type: 'forex', exchange: 'FOREX', tradingViewSymbol: 'FX:AUDUSD' },
    { symbol: 'USDCAD', name: 'US Dollar vs Canadian Dollar', type: 'forex', exchange: 'FOREX', tradingViewSymbol: 'FX:USDCAD' },
    { symbol: 'NZDUSD', name: 'New Zealand Dollar vs US Dollar', type: 'forex', exchange: 'FOREX', tradingViewSymbol: 'FX:NZDUSD' },
    { symbol: 'EURGBP', name: 'Euro vs British Pound', type: 'forex', exchange: 'FOREX', tradingViewSymbol: 'FX:EURGBP' },
    { symbol: 'EURJPY', name: 'Euro vs Japanese Yen', type: 'forex', exchange: 'FOREX', tradingViewSymbol: 'FX:EURJPY' },
    { symbol: 'GBPJPY', name: 'British Pound vs Japanese Yen', type: 'forex', exchange: 'FOREX', tradingViewSymbol: 'FX:GBPJPY' },
    
    // Commodities
    { symbol: 'XAUUSD', name: 'Gold', type: 'commodity', exchange: 'FOREX', tradingViewSymbol: 'FX:XAUUSD' },
    { symbol: 'XAGUSD', name: 'Silver', type: 'commodity', exchange: 'FOREX', tradingViewSymbol: 'FX:XAGUSD' },
    { symbol: 'USOIL', name: 'Crude Oil WTI', type: 'commodity', exchange: 'FOREX', tradingViewSymbol: 'FX:USOIL' },
    { symbol: 'UKOIL', name: 'Crude Oil Brent', type: 'commodity', exchange: 'FOREX', tradingViewSymbol: 'FX:UKOIL' },
    { symbol: 'NATGAS', name: 'Natural Gas', type: 'commodity', exchange: 'FOREX', tradingViewSymbol: 'FX:NATGAS' },
    { symbol: 'COPPER', name: 'Copper', type: 'commodity', exchange: 'FOREX', tradingViewSymbol: 'FX:COPPER' },
    { symbol: 'PLATINUM', name: 'Platinum', type: 'commodity', exchange: 'FOREX', tradingViewSymbol: 'FX:PLATINUM' },
    { symbol: 'PALLADIUM', name: 'Palladium', type: 'commodity', exchange: 'FOREX', tradingViewSymbol: 'FX:PALLADIUM' },
    
    // Major US Stocks
    { symbol: 'AAPL', name: 'Apple Inc', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:AAPL' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:MSFT' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:GOOGL' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:AMZN' },
    { symbol: 'TSLA', name: 'Tesla Inc', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:TSLA' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:NVDA' },
    { symbol: 'META', name: 'Meta Platforms Inc', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:META' },
    { symbol: 'NFLX', name: 'Netflix Inc', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:NFLX' },
    { symbol: 'ADBE', name: 'Adobe Inc', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:ADBE' },
    { symbol: 'CRM', name: 'Salesforce Inc', type: 'stock', exchange: 'NYSE', tradingViewSymbol: 'NYSE:CRM' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co', type: 'stock', exchange: 'NYSE', tradingViewSymbol: 'NYSE:JPM' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'stock', exchange: 'NYSE', tradingViewSymbol: 'NYSE:JNJ' },
    { symbol: 'PG', name: 'Procter & Gamble Co', type: 'stock', exchange: 'NYSE', tradingViewSymbol: 'NYSE:PG' },
    { symbol: 'V', name: 'Visa Inc', type: 'stock', exchange: 'NYSE', tradingViewSymbol: 'NYSE:V' },
    { symbol: 'WMT', name: 'Walmart Inc', type: 'stock', exchange: 'NYSE', tradingViewSymbol: 'NYSE:WMT' },
    { symbol: 'DIS', name: 'Walt Disney Co', type: 'stock', exchange: 'NYSE', tradingViewSymbol: 'NYSE:DIS' },
    { symbol: 'KO', name: 'Coca-Cola Co', type: 'stock', exchange: 'NYSE', tradingViewSymbol: 'NYSE:KO' },
    { symbol: 'PEP', name: 'PepsiCo Inc', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:PEP' },
    { symbol: 'INTC', name: 'Intel Corporation', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:INTC' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', type: 'stock', exchange: 'NASDAQ', tradingViewSymbol: 'NASDAQ:AMD' },
    
    // Major Indices
    { symbol: 'SPX', name: 'S&P 500', type: 'index', exchange: 'INDEX', tradingViewSymbol: 'SP:SPX' },
    { symbol: 'NDX', name: 'NASDAQ 100', type: 'index', exchange: 'INDEX', tradingViewSymbol: 'NASDAQ:NDX' },
    { symbol: 'DJI', name: 'Dow Jones Industrial Average', type: 'index', exchange: 'INDEX', tradingViewSymbol: 'DJ:DJI' },
    { symbol: 'RUT', name: 'Russell 2000', type: 'index', exchange: 'INDEX', tradingViewSymbol: 'RUSSELL:RUT' },
    { symbol: 'VIX', name: 'CBOE Volatility Index', type: 'index', exchange: 'INDEX', tradingViewSymbol: 'CBOE:VIX' },
    { symbol: 'FTSE', name: 'FTSE 100', type: 'index', exchange: 'INDEX', tradingViewSymbol: 'FTSE:FTSE' },
    { symbol: 'DAX', name: 'DAX Index', type: 'index', exchange: 'INDEX', tradingViewSymbol: 'DEU:DAX' },
    { symbol: 'NIKKEI', name: 'Nikkei 225', type: 'index', exchange: 'INDEX', tradingViewSymbol: 'NIKKEI:NIKKEI' },
    { symbol: 'HANG SENG', name: 'Hang Seng Index', type: 'index', exchange: 'INDEX', tradingViewSymbol: 'HKSE:HSI' },
    
    // Indian Markets (keeping some for reference)
    { symbol: 'NIFTY50', name: 'Nifty 50', type: 'index', exchange: 'NSE', tradingViewSymbol: 'NSE:NIFTY' },
    { symbol: 'BANKNIFTY', name: 'Bank Nifty', type: 'index', exchange: 'NSE', tradingViewSymbol: 'NSE:BANKNIFTY' },
    { symbol: 'SENSEX', name: 'BSE Sensex', type: 'index', exchange: 'BSE', tradingViewSymbol: 'BSE:SENSEX' },
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = stockData.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
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
    onSymbolSelect(suggestion.tradingViewSymbol);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crypto':
        return <Bitcoin className="h-4 w-4 text-yellow-500" />;
      case 'forex':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'commodity':
        return <Zap className="h-4 w-4 text-orange-500" />;
      case 'stock':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'index':
        return <BarChart3 className="h-4 w-4 text-purple-500" />;
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
          placeholder="Search crypto, forex, stocks, commodities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
          className="pl-10 pr-4 bg-secondary/50 border-muted focus:border-primary"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-secondary border border-muted rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
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