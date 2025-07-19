import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, TrendingUp, TrendingDown, Star, Menu, Bitcoin, DollarSign, Zap, BarChart3, Clock, DollarSign as DollarIcon, MoreVertical, Plus, Minus, Target, AlertTriangle } from 'lucide-react';
import TradingChart from './TradingChart';
import StockSearchBar from './StockSearchBar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface VirtualTradingProps {
  selectedSymbol: string;
  currentPrice?: number;
}

interface Instrument {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isFavorite?: boolean;
  type: 'crypto' | 'forex' | 'commodity' | 'stock' | 'index';
  tradingViewSymbol: string;
}

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  openTime: Date;
  closeTime?: Date;
  pnl: number;
  pnlPercent: number;
  status: 'OPEN' | 'CLOSED';
  stopLoss?: number;
  takeProfit?: number;
  closePrice?: number;
  finalPnl?: number;
}

// Mock user portfolio (no authentication required)
const mockPortfolio = {
  initialBalance: 10000,
  balance: 10000,
  equity: 10000,
  margin: 0,
  freeMargin: 10000,
  marginLevel: 0,
  pnl: 0,
  totalProfit: 0,
  totalLoss: 0
};

// Comprehensive instrument list with TradingView symbols
const allInstruments: Instrument[] = [
  // Cryptocurrencies
  { symbol: 'BTCUSD', name: 'Bitcoin', price: 43250.75, change: 850.22, changePercent: 2.01, isFavorite: true, type: 'crypto', tradingViewSymbol: 'BINANCE:BTCUSDT' },
  { symbol: 'ETHUSD', name: 'Ethereum', price: 2650.45, change: 45.30, changePercent: 1.74, isFavorite: true, type: 'crypto', tradingViewSymbol: 'BINANCE:ETHUSDT' },
  { symbol: 'BNBUSD', name: 'Binance Coin', price: 315.80, change: 8.45, changePercent: 2.75, isFavorite: true, type: 'crypto', tradingViewSymbol: 'BINANCE:BNBUSDT' },
  { symbol: 'ADAUSD', name: 'Cardano', price: 0.485, change: 0.025, changePercent: 5.43, type: 'crypto', tradingViewSymbol: 'BINANCE:ADAUSDT' },
  { symbol: 'SOLUSD', name: 'Solana', price: 98.75, change: 3.25, changePercent: 3.40, type: 'crypto', tradingViewSymbol: 'BINANCE:SOLUSDT' },
  { symbol: 'DOTUSD', name: 'Polkadot', price: 7.85, change: 0.15, changePercent: 1.95, type: 'crypto', tradingViewSymbol: 'BINANCE:DOTUSDT' },
  { symbol: 'MATICUSD', name: 'Polygon', price: 0.92, change: 0.03, changePercent: 3.37, type: 'crypto', tradingViewSymbol: 'BINANCE:MATICUSDT' },
  { symbol: 'LINKUSD', name: 'Chainlink', price: 15.45, change: 0.35, changePercent: 2.32, type: 'crypto', tradingViewSymbol: 'BINANCE:LINKUSDT' },
  { symbol: 'UNIUSD', name: 'Uniswap', price: 8.75, change: 0.25, changePercent: 2.94, type: 'crypto', tradingViewSymbol: 'BINANCE:UNIUSDT' },
  { symbol: 'AVAXUSD', name: 'Avalanche', price: 35.60, change: 1.20, changePercent: 3.48, type: 'crypto', tradingViewSymbol: 'BINANCE:AVAXUSDT' },
  
  // Forex Pairs
  { symbol: 'EURUSD', name: 'Euro vs US Dollar', price: 1.0875, change: 0.0023, changePercent: 0.21, isFavorite: true, type: 'forex', tradingViewSymbol: 'FX:EURUSD' },
  { symbol: 'GBPUSD', name: 'British Pound vs US Dollar', price: 1.2650, change: -0.0045, changePercent: -0.35, isFavorite: true, type: 'forex', tradingViewSymbol: 'FX:GBPUSD' },
  { symbol: 'USDJPY', name: 'US Dollar vs Japanese Yen', price: 148.95, change: 0.85, changePercent: 0.57, isFavorite: true, type: 'forex', tradingViewSymbol: 'FX:USDJPY' },
  { symbol: 'USDCHF', name: 'US Dollar vs Swiss Franc', price: 0.8750, change: -0.0020, changePercent: -0.23, type: 'forex', tradingViewSymbol: 'FX:USDCHF' },
  { symbol: 'AUDUSD', name: 'Australian Dollar vs US Dollar', price: 0.6650, change: 0.0030, changePercent: 0.45, type: 'forex', tradingViewSymbol: 'FX:AUDUSD' },
  { symbol: 'USDCAD', name: 'US Dollar vs Canadian Dollar', price: 1.3450, change: -0.0050, changePercent: -0.37, type: 'forex', tradingViewSymbol: 'FX:USDCAD' },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar vs US Dollar', price: 0.6150, change: 0.0020, changePercent: 0.33, type: 'forex', tradingViewSymbol: 'FX:NZDUSD' },
  { symbol: 'EURGBP', name: 'Euro vs British Pound', price: 0.8600, change: 0.0030, changePercent: 0.35, type: 'forex', tradingViewSymbol: 'FX:EURGBP' },
  { symbol: 'EURJPY', name: 'Euro vs Japanese Yen', price: 162.00, change: 1.20, changePercent: 0.75, type: 'forex', tradingViewSymbol: 'FX:EURJPY' },
  { symbol: 'GBPJPY', name: 'British Pound vs Japanese Yen', price: 188.50, change: 0.80, changePercent: 0.43, type: 'forex', tradingViewSymbol: 'FX:GBPJPY' },
  
  // Commodities
  { symbol: 'XAUUSD', name: 'Gold', price: 2045.32, change: -12.45, changePercent: -0.61, isFavorite: true, type: 'commodity', tradingViewSymbol: 'FX:XAUUSD' },
  { symbol: 'XAGUSD', name: 'Silver', price: 24.85, change: -0.15, changePercent: -0.60, type: 'commodity', tradingViewSymbol: 'FX:XAGUSD' },
  { symbol: 'USOIL', name: 'Crude Oil WTI', price: 72.85, change: -1.25, changePercent: -1.69, isFavorite: true, type: 'commodity', tradingViewSymbol: 'FX:USOIL' },
  { symbol: 'UKOIL', name: 'Crude Oil Brent', price: 77.45, change: -1.35, changePercent: -1.71, type: 'commodity', tradingViewSymbol: 'FX:UKOIL' },
  { symbol: 'NATGAS', name: 'Natural Gas', price: 2.85, change: 0.05, changePercent: 1.79, type: 'commodity', tradingViewSymbol: 'FX:NATGAS' },
  { symbol: 'COPPER', name: 'Copper', price: 4.25, change: 0.05, changePercent: 1.19, type: 'commodity', tradingViewSymbol: 'FX:COPPER' },
  { symbol: 'PLATINUM', name: 'Platinum', price: 950.50, change: -5.50, changePercent: -0.58, type: 'commodity', tradingViewSymbol: 'FX:PLATINUM' },
  { symbol: 'PALLADIUM', name: 'Palladium', price: 1050.00, change: -15.00, changePercent: -1.41, type: 'commodity', tradingViewSymbol: 'FX:PALLADIUM' },
  
  // Major US Stocks
  { symbol: 'AAPL', name: 'Apple Inc', price: 195.89, change: 2.45, changePercent: 1.27, isFavorite: true, type: 'stock', tradingViewSymbol: 'NASDAQ:AAPL' },
  { symbol: 'MSFT', name: 'Microsoft', price: 378.85, change: -2.45, changePercent: -0.64, type: 'stock', tradingViewSymbol: 'NASDAQ:MSFT' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 142.65, change: 1.85, changePercent: 1.31, type: 'stock', tradingViewSymbol: 'NASDAQ:GOOGL' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', price: 155.75, change: 3.25, changePercent: 2.13, type: 'stock', tradingViewSymbol: 'NASDAQ:AMZN' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: 5.25, changePercent: 2.16, type: 'stock', tradingViewSymbol: 'NASDAQ:TSLA' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 481.20, change: 12.85, changePercent: 2.75, type: 'stock', tradingViewSymbol: 'NASDAQ:NVDA' },
  { symbol: 'META', name: 'Meta Platforms', price: 355.70, change: -8.30, changePercent: -2.28, type: 'stock', tradingViewSymbol: 'NASDAQ:META' },
  { symbol: 'NFLX', name: 'Netflix Inc', price: 485.50, change: 15.30, changePercent: 3.25, type: 'stock', tradingViewSymbol: 'NASDAQ:NFLX' },
  { symbol: 'ADBE', name: 'Adobe Inc', price: 485.25, change: 8.75, changePercent: 1.84, type: 'stock', tradingViewSymbol: 'NASDAQ:ADBE' },
  { symbol: 'CRM', name: 'Salesforce Inc', price: 245.80, change: 4.20, changePercent: 1.74, type: 'stock', tradingViewSymbol: 'NYSE:CRM' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co', price: 185.45, change: 1.25, changePercent: 0.68, type: 'stock', tradingViewSymbol: 'NYSE:JPM' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 165.30, change: -0.70, changePercent: -0.42, type: 'stock', tradingViewSymbol: 'NYSE:JNJ' },
  { symbol: 'PG', name: 'Procter & Gamble Co', price: 155.80, change: 0.80, changePercent: 0.52, type: 'stock', tradingViewSymbol: 'NYSE:PG' },
  { symbol: 'V', name: 'Visa Inc', price: 275.45, change: 3.55, changePercent: 1.30, type: 'stock', tradingViewSymbol: 'NYSE:V' },
  { symbol: 'WMT', name: 'Walmart Inc', price: 165.75, change: 1.25, changePercent: 0.76, type: 'stock', tradingViewSymbol: 'NYSE:WMT' },
  { symbol: 'DIS', name: 'Walt Disney Co', price: 95.80, change: -1.20, changePercent: -1.24, type: 'stock', tradingViewSymbol: 'NYSE:DIS' },
  { symbol: 'KO', name: 'Coca-Cola Co', price: 62.45, change: 0.35, changePercent: 0.56, type: 'stock', tradingViewSymbol: 'NYSE:KO' },
  { symbol: 'PEP', name: 'PepsiCo Inc', price: 175.30, change: 2.10, changePercent: 1.21, type: 'stock', tradingViewSymbol: 'NASDAQ:PEP' },
  { symbol: 'INTC', name: 'Intel Corporation', price: 45.80, change: 0.60, changePercent: 1.33, type: 'stock', tradingViewSymbol: 'NASDAQ:INTC' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 125.45, change: 3.25, changePercent: 2.66, type: 'stock', tradingViewSymbol: 'NASDAQ:AMD' },
  
  // Major Indices
  { symbol: 'SPX', name: 'S&P 500', price: 4850.75, change: 25.50, changePercent: 0.53, isFavorite: true, type: 'index', tradingViewSymbol: 'SP:SPX' },
  { symbol: 'NDX', name: 'NASDAQ 100', price: 16875.45, change: 125.30, changePercent: 0.75, isFavorite: true, type: 'index', tradingViewSymbol: 'NASDAQ:NDX' },
  { symbol: 'DJI', name: 'Dow Jones Industrial Average', price: 37500.25, change: 150.75, changePercent: 0.40, type: 'index', tradingViewSymbol: 'DJ:DJI' },
  { symbol: 'RUT', name: 'Russell 2000', price: 1950.50, change: 15.25, changePercent: 0.79, type: 'index', tradingViewSymbol: 'RUSSELL:RUT' },
  { symbol: 'VIX', name: 'CBOE Volatility Index', price: 12.85, change: -0.45, changePercent: -3.38, type: 'index', tradingViewSymbol: 'CBOE:VIX' },
  { symbol: 'FTSE', name: 'FTSE 100', price: 7650.25, change: 25.50, changePercent: 0.33, type: 'index', tradingViewSymbol: 'FTSE:FTSE' },
  { symbol: 'DAX', name: 'DAX Index', price: 16850.75, change: 125.25, changePercent: 0.75, type: 'index', tradingViewSymbol: 'DEU:DAX' },
  { symbol: 'NIKKEI', name: 'Nikkei 225', price: 36500.50, change: 250.75, changePercent: 0.69, type: 'index', tradingViewSymbol: 'NIKKEI:NIKKEI' },
  { symbol: 'HANG SENG', name: 'Hang Seng Index', price: 16850.25, change: 125.50, changePercent: 0.75, type: 'index', tradingViewSymbol: 'HKSE:HSI' },
];

export const VirtualTrading = ({ selectedSymbol, currentPrice = 0 }: VirtualTradingProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSymbol, setActiveSymbol] = useState(selectedSymbol || 'BINANCE:BTCUSDT');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [volume, setVolume] = useState('0.01');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [portfolio, setPortfolio] = useState(mockPortfolio);
  const [instruments] = useState(allInstruments);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});

  const filteredInstruments = instruments.filter(instrument =>
    instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instrument.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentInstrument = instruments.find(i => i.tradingViewSymbol === activeSymbol) || instruments[0];
  const instrumentPrice = livePrices[activeSymbol] || currentPrice || currentInstrument.price;

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newPrices: Record<string, number> = {};
      instruments.forEach(instrument => {
        // Simulate price movement with small random changes
        const currentPrice = livePrices[instrument.tradingViewSymbol] || instrument.price;
        const change = (Math.random() - 0.5) * 0.002; // ±0.1% change
        newPrices[instrument.tradingViewSymbol] = currentPrice * (1 + change);
      });
      setLivePrices(newPrices);
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [livePrices, instruments]);

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes('JPY')) return price.toFixed(3);
    if (symbol.includes('USD') && !symbol.includes('XAU')) return price.toFixed(5);
    return price.toFixed(2);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Calculate proper lot size based on instrument type
  const getLotSize = (symbol: string) => {
    if (symbol.includes('BINANCE:')) return 1; // Crypto: 1 unit
    if (symbol.includes('FX:')) return 100000; // Forex: 100k units (standard lot)
    if (symbol.includes('NASDAQ:') || symbol.includes('NYSE:')) return 100; // Stocks: 100 shares
    return 1; // Default
  };

  // Calculate trade value with proper lot size and volume
  const calculateTradeValue = () => {
    const volumeNum = parseFloat(volume || '0');
    const lotSize = getLotSize(activeSymbol);
    // For forex, 1 lot = 100,000 units, but we want to show realistic values
    // So we'll use a smaller multiplier for display purposes
    const displayMultiplier = activeSymbol.includes('FX:') ? 1000 : lotSize;
    return volumeNum * displayMultiplier * instrumentPrice;
  };

  const handleSymbolSelect = (selectedSymbol: string) => {
    setActiveSymbol(selectedSymbol);
  };

  const handlePlaceTrade = () => {
    const volumeNum = parseFloat(volume);
    const tradeValue = calculateTradeValue();
    
    if (tradeValue > portfolio.freeMargin) {
      alert('Insufficient margin for this trade');
      return;
    }

    // Create new trade
    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: currentInstrument.symbol,
      type: tradeType,
      volume: volumeNum,
      openPrice: instrumentPrice,
      currentPrice: instrumentPrice,
      openTime: new Date(),
      pnl: 0,
      pnlPercent: 0,
      status: 'OPEN'
    };

    setTrades(prev => [...prev, newTrade]);
    
    // Update portfolio
    setPortfolio(prev => ({
      ...prev,
      freeMargin: prev.freeMargin - tradeValue,
      margin: prev.margin + tradeValue
    }));

    alert(`${tradeType} order placed: ${volume} lots of ${currentInstrument.symbol} at ${formatPrice(instrumentPrice, activeSymbol)}`);
  };

  // Update PnL for open trades with live prices
  useEffect(() => {
    const updatedTrades = trades.map(trade => {
      if (trade.status === 'OPEN') {
        const currentPrice = livePrices[activeSymbol] || instrumentPrice;
        const priceDiff = currentPrice - trade.openPrice;
        const pnl = trade.type === 'BUY' ? priceDiff : -priceDiff;
        const pnlValue = pnl * trade.volume * getLotSize(activeSymbol);
        const pnlPercent = (pnl / trade.openPrice) * 100;
        
        return {
          ...trade,
          currentPrice: currentPrice,
          pnl: pnlValue,
          pnlPercent: pnlPercent
        };
      }
      return trade;
    });

    setTrades(updatedTrades);

    // Update portfolio PnL
    const totalPnl = updatedTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    setPortfolio(prev => ({
      ...prev,
      pnl: totalPnl,
      equity: prev.balance + totalPnl
    }));
  }, [livePrices, activeSymbol, instrumentPrice]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crypto':
        return <Bitcoin className="h-3 w-3 text-yellow-500" />;
      case 'forex':
        return <DollarSign className="h-3 w-3 text-green-500" />;
      case 'commodity':
        return <Zap className="h-3 w-3 text-orange-500" />;
      case 'stock':
        return <TrendingUp className="h-3 w-3 text-blue-500" />;
      case 'index':
        return <BarChart3 className="h-3 w-3 text-purple-500" />;
      default:
        return null;
    }
  };

  const formatSymbolForDisplay = (symbol: string) => {
    if (symbol.includes('BINANCE:')) {
      const crypto = symbol.replace('BINANCE:', '').replace('USDT', '');
      return `${crypto} vs USD`;
    }
    if (symbol.includes('FX:')) {
      const forex = symbol.replace('FX:', '');
      return `${forex.slice(0, 3)} vs ${forex.slice(3)}`;
    }
    if (symbol.includes('NASDAQ:') || symbol.includes('NYSE:')) {
      return symbol.split(':')[1];
    }
    return symbol;
  };

  // Trade management functions
  const handleSellPosition = (tradeId: string) => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;

    const closePrice = instrumentPrice;
    const priceDiff = closePrice - trade.openPrice;
    const finalPnl = trade.type === 'BUY' ? priceDiff : -priceDiff;
    const finalPnlValue = finalPnl * trade.volume * getLotSize(activeSymbol);

    // Update trade with close details
    setTrades(prev => prev.map(t => 
      t.id === tradeId ? { 
        ...t, 
        status: 'CLOSED',
        closeTime: new Date(),
        closePrice: closePrice,
        finalPnl: finalPnlValue
      } : t
    ));

    // Update portfolio balance
    setPortfolio(prev => ({
      ...prev,
      balance: prev.balance + finalPnlValue,
      freeMargin: prev.freeMargin + (trade.volume * getLotSize(activeSymbol) * trade.openPrice),
      margin: prev.margin - (trade.volume * getLotSize(activeSymbol) * trade.openPrice),
      totalProfit: finalPnlValue > 0 ? prev.totalProfit + finalPnlValue : prev.totalProfit,
      totalLoss: finalPnlValue < 0 ? prev.totalLoss + Math.abs(finalPnlValue) : prev.totalLoss
    }));

    alert(`Position closed: ${finalPnlValue >= 0 ? 'Profit' : 'Loss'} ${formatCurrency(Math.abs(finalPnlValue))}`);
  };

  const handleBuyMore = (trade: Trade) => {
    const additionalVolume = parseFloat(volume);
    const tradeValue = additionalVolume * getLotSize(activeSymbol) * instrumentPrice;
    
    if (tradeValue > portfolio.freeMargin) {
      alert('Insufficient margin for additional position');
      return;
    }

    // Add to existing position
    setTrades(prev => prev.map(t => 
      t.id === trade.id 
        ? { ...t, volume: t.volume + additionalVolume }
        : t
    ));
    
    setPortfolio(prev => ({
      ...prev,
      freeMargin: prev.freeMargin - tradeValue,
      margin: prev.margin + tradeValue
    }));
    
    alert(`Added ${additionalVolume} lots to position`);
  };

  const handleAddStopLoss = (tradeId: string, stopLossPrice: number) => {
    setTrades(prev => prev.map(trade => 
      trade.id === tradeId ? { ...trade, stopLoss: stopLossPrice } : trade
    ));
    alert('Stop loss added successfully');
  };

  const handleAddTakeProfit = (tradeId: string, takeProfitPrice: number) => {
    setTrades(prev => prev.map(trade => 
      trade.id === tradeId ? { ...trade, takeProfit: takeProfitPrice } : trade
    ));
    alert('Take profit added successfully');
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Top Bar with Search and Portfolio Info */}
      <div className="h-16 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-white">Global Trading Platform</h1>
          
          {/* Search Bar */}
          <div className="relative w-80">
            <StockSearchBar onSymbolSelect={handleSymbolSelect} />
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <span className="text-green-400">Balance: {formatCurrency(portfolio.balance)}</span>
          <span className="text-blue-400">Initial: {formatCurrency(portfolio.initialBalance)}</span>
          <span className="text-yellow-400">Free Margin: {formatCurrency(portfolio.freeMargin)}</span>
          <span className={`${portfolio.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            Live P&L: {formatCurrency(portfolio.pnl)}
          </span>
          <span className="text-green-400">Total Profit: {formatCurrency(portfolio.totalProfit)}</span>
          <span className="text-red-400">Total Loss: {formatCurrency(portfolio.totalLoss)}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Instruments */}
        <div className="w-80 bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
          <Tabs defaultValue="favorites" className="w-full h-full">
            <TabsList className="w-full bg-[#2a2a2a] border-b border-gray-800 rounded-none h-12">
              <TabsTrigger value="favorites" className="flex-1 text-gray-300">Favorites</TabsTrigger>
              <TabsTrigger value="all" className="flex-1 text-gray-300">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value="favorites" className="mt-0 flex-1 overflow-y-auto">
              <div className="space-y-1">
                {instruments.filter(i => i.isFavorite).map((instrument) => (
                  <div
                    key={instrument.symbol}
                    onClick={() => setActiveSymbol(instrument.tradingViewSymbol)}
                    className={`p-3 hover:bg-[#2a2a2a] cursor-pointer border-l-2 transition-colors ${
                      activeSymbol === instrument.tradingViewSymbol ? 'bg-[#2a2a2a] border-l-blue-500' : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(instrument.type)}
                        <span className="text-sm font-medium">{instrument.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono">{formatPrice(livePrices[instrument.tradingViewSymbol] || instrument.price, instrument.symbol)}</div>
                        <div className={`text-xs flex items-center gap-1 ${
                          instrument.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {instrument.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {instrument.change >= 0 ? '+' : ''}{instrument.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-0 flex-1 overflow-y-auto">
              <div className="space-y-1">
                {filteredInstruments.map((instrument) => (
                  <div
                    key={instrument.symbol}
                    onClick={() => setActiveSymbol(instrument.tradingViewSymbol)}
                    className={`p-3 hover:bg-[#2a2a2a] cursor-pointer border-l-2 transition-colors ${
                      activeSymbol === instrument.tradingViewSymbol ? 'bg-[#2a2a2a] border-l-blue-500' : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(instrument.type)}
                          <span className="text-sm font-medium">{instrument.symbol}</span>
                        </div>
                        <div className="text-xs text-gray-400">{instrument.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono">{formatPrice(livePrices[instrument.tradingViewSymbol] || instrument.price, instrument.symbol)}</div>
                        <div className={`text-xs ${instrument.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {instrument.change >= 0 ? '+' : ''}{instrument.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col">
          {/* Chart Header */}
          <div className="h-12 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">{formatSymbolForDisplay(activeSymbol)}</h2>
              <div className="flex items-center gap-2">
                <span className="text-xl font-mono">{formatPrice(instrumentPrice, activeSymbol)}</span>
                <Badge variant={currentInstrument.change >= 0 ? "default" : "destructive"} className="ml-2">
                  {currentInstrument.change >= 0 ? '+' : ''}{currentInstrument.changePercent.toFixed(2)}%
                </Badge>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 bg-[#0a0a0a] p-4">
            <div className="h-full bg-[#1a1a1a] rounded-lg overflow-hidden">
              <TradingChart symbol={activeSymbol} height={400} />
            </div>
          </div>

          {/* Trading Panel - Horizontal Layout */}
          <div className="h-32 bg-[#1a1a1a] border-t border-gray-800 p-4">
            <div className="flex items-center justify-between h-full">
              {/* Left Side - Symbol Info */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">{formatSymbolForDisplay(activeSymbol)}</h3>
                  <div className="text-2xl font-mono text-white">{formatPrice(instrumentPrice, activeSymbol)}</div>
                </div>
                
                {/* Buy/Sell Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={tradeType === 'BUY' ? 'default' : 'outline'}
                    onClick={() => setTradeType('BUY')}
                    className="bg-green-600 hover:bg-green-700 text-white border-green-600 px-6"
                  >
                    BUY
                  </Button>
                  <Button
                    variant={tradeType === 'SELL' ? 'default' : 'outline'}
                    onClick={() => setTradeType('SELL')}
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600 px-6"
                  >
                    SELL
                  </Button>
                </div>
              </div>

              {/* Center - Trading Inputs */}
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Volume (Lots)</label>
                  <Input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    step="0.01"
                    min="0.01"
                    className="bg-[#2a2a2a] border-gray-600 text-white w-24"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Take Profit</label>
                  <Input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="Not set"
                    step="0.01"
                    className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-500 w-24"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Stop Loss</label>
                  <Input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="Not set"
                    step="0.01"
                    className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-500 w-24"
                  />
                </div>
              </div>

              {/* Right Side - Trade Button and Value */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400">Trade Value</div>
                  <div className="text-lg font-mono text-white">
                    {formatCurrency(calculateTradeValue())}
                  </div>
                </div>
                
                <Button
                  onClick={handlePlaceTrade}
                  className={`px-8 py-3 ${
                    tradeType === 'BUY' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white font-semibold`}
                >
                  {tradeType} {currentInstrument.symbol}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Trade History Panel */}
      <div className="h-48 bg-[#1a1a1a] border-t border-gray-800">
        <Tabs defaultValue="open" className="w-full h-full">
          <TabsList className="w-full bg-[#2a2a2a] border-b border-gray-800 rounded-none h-12">
            <TabsTrigger value="open" className="flex-1 text-gray-300">Open Positions</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 text-gray-300">Pending Orders</TabsTrigger>
            <TabsTrigger value="history" className="flex-1 text-gray-300">Trade History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="open" className="mt-0 h-full">
            <div className="h-full overflow-y-auto">
              {trades.filter(t => t.status === 'OPEN').length > 0 ? (
                <div className="p-4">
                  <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-400 border-b border-gray-700 pb-2 mb-2">
                    <div>Symbol</div>
                    <div>Type</div>
                    <div>Volume</div>
                    <div>Open Price</div>
                    <div>Current Price</div>
                    <div>P&L</div>
                    <div>Time</div>
                    <div>Actions</div>
                  </div>
                  {trades.filter(t => t.status === 'OPEN').map((trade) => (
                    <div key={trade.id} className="grid grid-cols-8 gap-4 text-sm py-2 border-b border-gray-800">
                      <div className="font-medium">{trade.symbol}</div>
                      <div className={`font-medium ${trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.type}
                      </div>
                      <div>{trade.volume}</div>
                      <div className="font-mono">{formatPrice(trade.openPrice, trade.symbol)}</div>
                      <div className="font-mono">{formatPrice(trade.currentPrice, trade.symbol)}</div>
                      <div className={`font-mono ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(trade.pnl)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {trade.openTime.toLocaleTimeString()}
                      </div>
                      <div className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleSellPosition(trade.id)}>
                              <Minus className="h-4 w-4 mr-2 text-red-400" />
                              Sell Position
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBuyMore(trade)}>
                              <Plus className="h-4 w-4 mr-2 text-green-400" />
                              Buy More
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddStopLoss(trade.id, instrumentPrice * 0.95)}>
                              <AlertTriangle className="h-4 w-4 mr-2 text-orange-400" />
                              Add Stop Loss
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAddTakeProfit(trade.id, instrumentPrice * 1.05)}>
                              <Target className="h-4 w-4 mr-2 text-blue-400" />
                              Add Take Profit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Clock className="h-8 w-8 mr-2" />
                  No open positions
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-0 h-full">
            <div className="flex items-center justify-center h-full text-gray-400">
              <Clock className="h-8 w-8 mr-2" />
              No pending orders
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0 h-full">
            <div className="h-full overflow-y-auto">
              {trades.filter(t => t.status === 'CLOSED').length > 0 ? (
                <div className="p-4">
                  <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-400 border-b border-gray-700 pb-2 mb-2">
                    <div>Symbol</div>
                    <div>Type</div>
                    <div>Volume</div>
                    <div>Open Price</div>
                    <div>Close Price</div>
                    <div>Final P&L</div>
                    <div>Open Time</div>
                    <div>Close Time</div>
                  </div>
                  {trades.filter(t => t.status === 'CLOSED').map((trade) => (
                    <div key={trade.id} className="grid grid-cols-8 gap-4 text-sm py-2 border-b border-gray-800">
                      <div className="font-medium">{trade.symbol}</div>
                      <div className={`font-medium ${trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.type}
                      </div>
                      <div>{trade.volume}</div>
                      <div className="font-mono">{formatPrice(trade.openPrice, trade.symbol)}</div>
                      <div className="font-mono">{formatPrice(trade.closePrice || 0, trade.symbol)}</div>
                      <div className={`font-mono ${trade.finalPnl && trade.finalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.finalPnl ? formatCurrency(trade.finalPnl) : '$0.00'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {trade.openTime.toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {trade.closeTime ? trade.closeTime.toLocaleTimeString() : '-'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <DollarIcon className="h-8 w-8 mr-2" />
                  No trade history
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};