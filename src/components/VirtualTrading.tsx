import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, TrendingUp, TrendingDown, Star, Menu } from 'lucide-react';
import TradingChart from './TradingChart';

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
}

// Mock user portfolio (no authentication required)
const mockPortfolio = {
  balance: 10000,
  equity: 10000,
  margin: 0,
  freeMargin: 10000,
  marginLevel: 0,
  pnl: 0
};

// Mock favorite instruments
const favoriteInstruments: Instrument[] = [
  { symbol: 'XAUUSD', name: 'Gold', price: 2045.32, change: -12.45, changePercent: -0.61, isFavorite: true },
  { symbol: 'BTCUSD', name: 'Bitcoin', price: 43250.75, change: 850.22, changePercent: 2.01, isFavorite: true },
  { symbol: 'AAPL', name: 'Apple Inc', price: 195.89, change: 2.45, changePercent: 1.27, isFavorite: true },
  { symbol: 'EURUSD', name: 'Euro vs Dollar', price: 1.0875, change: 0.0023, changePercent: 0.21, isFavorite: true },
  { symbol: 'GBPUSD', name: 'Pound vs Dollar', price: 1.2650, change: -0.0045, changePercent: -0.35, isFavorite: true },
  { symbol: 'USDJPY', name: 'Dollar vs Yen', price: 148.95, change: 0.85, changePercent: 0.57, isFavorite: true },
  { symbol: 'USOIL', name: 'US Oil', price: 72.85, change: -1.25, changePercent: -1.69, isFavorite: true },
  { symbol: 'USTEC', name: 'US Tech 100', price: 16875.45, change: 125.30, changePercent: 0.75, isFavorite: true }
];

// All available instruments for search
const allInstruments: Instrument[] = [
  ...favoriteInstruments,
  { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: 5.25, changePercent: 2.16 },
  { symbol: 'MSFT', name: 'Microsoft', price: 378.85, change: -2.45, changePercent: -0.64 },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 142.65, change: 1.85, changePercent: 1.31 },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 481.20, change: 12.85, changePercent: 2.75 },
  { symbol: 'META', name: 'Meta Platforms', price: 355.70, change: -8.30, changePercent: -2.28 },
];

export const VirtualTrading = ({ selectedSymbol, currentPrice = 0 }: VirtualTradingProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSymbol, setActiveSymbol] = useState(selectedSymbol || 'BTCUSD');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [volume, setVolume] = useState('0.01');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [portfolio] = useState(mockPortfolio);
  const [instruments] = useState(allInstruments);

  const filteredInstruments = instruments.filter(instrument =>
    instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instrument.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentInstrument = instruments.find(i => i.symbol === activeSymbol) || instruments[0];
  const instrumentPrice = currentPrice > 0 ? currentPrice : currentInstrument.price;

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

  const handlePlaceTrade = () => {
    const volumeNum = parseFloat(volume);
    const lotSize = activeSymbol.includes('USD') && !activeSymbol.includes('XAU') ? 100000 : 1;
    const tradeValue = volumeNum * lotSize * instrumentPrice;
    
    if (tradeValue > portfolio.freeMargin) {
      alert('Insufficient margin for this trade');
      return;
    }

    // Mock trade execution
    alert(`${tradeType} order placed: ${volume} lots of ${activeSymbol} at ${formatPrice(instrumentPrice, activeSymbol)}`);
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search instruments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2a2a2a] border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Instruments List */}
        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="favorites" className="w-full">
            <TabsList className="w-full bg-[#2a2a2a] border-b border-gray-800 rounded-none h-12">
              <TabsTrigger value="favorites" className="flex-1 text-gray-300">Favorites</TabsTrigger>
              <TabsTrigger value="all" className="flex-1 text-gray-300">All</TabsTrigger>
            </TabsList>
            
            <TabsContent value="favorites" className="mt-0">
              <div className="space-y-1">
                {favoriteInstruments.map((instrument) => (
                  <div
                    key={instrument.symbol}
                    onClick={() => setActiveSymbol(instrument.symbol)}
                    className={`p-3 hover:bg-[#2a2a2a] cursor-pointer border-l-2 transition-colors ${
                      activeSymbol === instrument.symbol ? 'bg-[#2a2a2a] border-l-blue-500' : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{instrument.symbol}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono">{formatPrice(instrument.price, instrument.symbol)}</div>
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
            
            <TabsContent value="all" className="mt-0">
              <div className="space-y-1">
                {filteredInstruments.map((instrument) => (
                  <div
                    key={instrument.symbol}
                    onClick={() => setActiveSymbol(instrument.symbol)}
                    className={`p-3 hover:bg-[#2a2a2a] cursor-pointer border-l-2 transition-colors ${
                      activeSymbol === instrument.symbol ? 'bg-[#2a2a2a] border-l-blue-500' : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{instrument.symbol}</div>
                        <div className="text-xs text-gray-400">{instrument.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono">{formatPrice(instrument.price, instrument.symbol)}</div>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 bg-[#1a1a1a] border-b border-gray-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{currentInstrument.symbol}</h1>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono">{formatPrice(instrumentPrice, activeSymbol)}</span>
              <Badge variant={currentInstrument.change >= 0 ? "default" : "destructive"} className="ml-2">
                {currentInstrument.change >= 0 ? '+' : ''}{currentInstrument.changePercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <span>Balance: {formatCurrency(portfolio.balance)}</span>
            <span>Equity: {formatCurrency(portfolio.equity)}</span>
            <span>Free Margin: {formatCurrency(portfolio.freeMargin)}</span>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Chart Area */}
          <div className="flex-1 bg-[#0a0a0a] p-4">
            <div className="h-full bg-[#1a1a1a] rounded-lg overflow-hidden">
              <TradingChart symbol={activeSymbol} height={600} />
            </div>
          </div>

          {/* Right Trading Panel */}
          <div className="w-80 bg-[#1a1a1a] border-l border-gray-800 p-4">
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardContent className="p-4 space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">{activeSymbol}</h3>
                  <div className="text-2xl font-mono text-white">{formatPrice(instrumentPrice, activeSymbol)}</div>
                </div>

                {/* Buy/Sell Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tradeType === 'BUY' ? 'default' : 'outline'}
                    onClick={() => setTradeType('BUY')}
                    className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                  >
                    BUY
                  </Button>
                  <Button
                    variant={tradeType === 'SELL' ? 'default' : 'outline'}
                    onClick={() => setTradeType('SELL')}
                    className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                  >
                    SELL
                  </Button>
                </div>

                {/* Volume Input */}
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Volume (Lots)</label>
                  <Input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    step="0.01"
                    min="0.01"
                    className="bg-[#1a1a1a] border-gray-600 text-white"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Value: {formatCurrency(parseFloat(volume || '0') * (activeSymbol.includes('USD') && !activeSymbol.includes('XAU') ? 100000 : 1) * instrumentPrice)}
                  </div>
                </div>

                {/* Take Profit */}
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Take Profit</label>
                  <Input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="Not set"
                    step="0.01"
                    className="bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-500"
                  />
                </div>

                {/* Stop Loss */}
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Stop Loss</label>
                  <Input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="Not set"
                    step="0.01"
                    className="bg-[#1a1a1a] border-gray-600 text-white placeholder-gray-500"
                  />
                </div>

                {/* Place Trade Button */}
                <Button
                  onClick={handlePlaceTrade}
                  className={`w-full ${
                    tradeType === 'BUY' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white font-semibold py-3`}
                >
                  {tradeType} {activeSymbol}
                </Button>

                {/* Portfolio Summary */}
                <div className="border-t border-gray-600 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Balance:</span>
                    <span className="text-white">{formatCurrency(portfolio.balance)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Equity:</span>
                    <span className="text-white">{formatCurrency(portfolio.equity)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Free Margin:</span>
                    <span className="text-white">{formatCurrency(portfolio.freeMargin)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">P&L:</span>
                    <span className={portfolio.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatCurrency(portfolio.pnl)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Positions/Orders Tabs */}
            <div className="mt-4">
              <Tabs defaultValue="positions" className="w-full">
                <TabsList className="w-full bg-[#2a2a2a] border border-gray-700">
                  <TabsTrigger value="positions" className="flex-1 text-gray-300">Positions</TabsTrigger>
                  <TabsTrigger value="orders" className="flex-1 text-gray-300">Orders</TabsTrigger>
                  <TabsTrigger value="history" className="flex-1 text-gray-300">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="positions" className="mt-2">
                  <Card className="bg-[#2a2a2a] border-gray-700">
                    <CardContent className="p-3">
                      <div className="text-center text-gray-400 text-sm py-8">
                        No open positions
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders" className="mt-2">
                  <Card className="bg-[#2a2a2a] border-gray-700">
                    <CardContent className="p-3">
                      <div className="text-center text-gray-400 text-sm py-8">
                        No pending orders
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history" className="mt-2">
                  <Card className="bg-[#2a2a2a] border-gray-700">
                    <CardContent className="p-3">
                      <div className="text-center text-gray-400 text-sm py-8">
                        No trading history
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};