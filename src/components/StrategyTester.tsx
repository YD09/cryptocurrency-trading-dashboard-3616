import { useState } from 'react';
import { Play, BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import StockSearchBar from './StockSearchBar';

interface BacktestResult {
  totalTrades: number;
  winRate: number;
  totalReturn: number;
  maxDrawdown: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
}

const StrategyTester = () => {
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('1D');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-15');
  const [strategy, setStrategy] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);

  const handleSymbolSelect = (selectedSymbol: string) => {
    // Extract the base symbol from TradingView format
    let baseSymbol = selectedSymbol;
    if (selectedSymbol.includes('BINANCE:')) {
      baseSymbol = selectedSymbol.replace('BINANCE:', '').replace('USDT', '');
    } else if (selectedSymbol.includes('FX:')) {
      baseSymbol = selectedSymbol.replace('FX:', '');
    } else if (selectedSymbol.includes('NASDAQ:') || selectedSymbol.includes('NYSE:')) {
      baseSymbol = selectedSymbol.split(':')[1];
    }
    setSymbol(baseSymbol);
  };

  const runBacktest = async () => {
    if (!symbol || !strategy) return;
    
    setIsRunning(true);
    
    // Simulate backtest execution
    setTimeout(() => {
      const mockResults: BacktestResult = {
        totalTrades: Math.floor(Math.random() * 50) + 20,
        winRate: Math.random() * 40 + 40, // 40-80%
        totalReturn: Math.random() * 50 + 10, // 10-60%
        maxDrawdown: Math.random() * 15 + 5, // 5-20%
        profitFactor: Math.random() * 2 + 1, // 1-3
        avgWin: Math.random() * 3 + 1, // 1-4%
        avgLoss: Math.random() * 2 + 0.5, // 0.5-2.5%
      };
      setResults(mockResults);
      setIsRunning(false);
    }, 3000);
  };

  const predefinedStrategies = [
    {
      name: 'Inside Candle Pattern',
      code: `// Inside Candle Strategy
if (high[1] < high[2] && low[1] > low[2]) {
  // Inside candle detected
  if (close > high[1]) {
    buy(); // Breakout above inside candle
  } else if (close < low[1]) {
    sell(); // Breakdown below inside candle
  }
}`
    },
    {
      name: 'Moving Average Crossover',
      code: `// MA Crossover Strategy
ema20 = ema(close, 20);
ema50 = ema(close, 50);

if (crossover(ema20, ema50)) {
  buy(); // Golden cross
} else if (crossunder(ema20, ema50)) {
  sell(); // Death cross
}`
    },
    {
      name: 'Support Resistance Breakout',
      code: `// Support/Resistance Breakout
resistance = highest(high, 20);
support = lowest(low, 20);

if (close > resistance) {
  buy(); // Resistance breakout
} else if (close < support) {
  sell(); // Support breakdown
}`
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Strategy Tester</h2>
        <p className="text-muted-foreground">Backtest your trading strategies on historical data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategy Input */}
        <Card className="glass-card border-muted">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Strategy Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Symbol
                </label>
                <StockSearchBar onSymbolSelect={handleSymbolSelect} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Timeframe
                </label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="bg-secondary/50 border-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5m">5 Minutes</SelectItem>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="1H">1 Hour</SelectItem>
                    <SelectItem value="1D">1 Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-secondary/50 border-muted"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  End Date
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-secondary/50 border-muted"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Strategy Code (Pine Script Style)
              </label>
              <Textarea
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="Enter your strategy logic here..."
                className="bg-secondary/50 border-muted h-32 font-mono text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Quick Templates
              </label>
              <div className="grid gap-2">
                {predefinedStrategies.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setStrategy(template.code)}
                    className="justify-start text-left border-muted hover:bg-muted/50"
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={runBacktest}
              disabled={!symbol || !strategy || isRunning}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full" />
                  Running Backtest...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Backtest
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="glass-card border-muted">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Backtest Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!results ? (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Run a backtest to see results</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="text-sm text-muted-foreground">Total Return</span>
                    </div>
                    <div className="text-xl font-bold text-success">
                      +{results.totalReturn.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {results.winRate.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center py-2 border-b border-muted/30">
                    <span className="text-muted-foreground">Total Trades</span>
                    <Badge variant="outline" className="border-muted">
                      {results.totalTrades}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-muted/30">
                    <span className="text-muted-foreground">Max Drawdown</span>
                    <span className="text-warning font-medium">
                      -{results.maxDrawdown.toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-muted/30">
                    <span className="text-muted-foreground">Profit Factor</span>
                    <span className="text-foreground font-medium">
                      {results.profitFactor.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-muted/30">
                    <span className="text-muted-foreground">Avg Win</span>
                    <span className="text-success font-medium">
                      +{results.avgWin.toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Avg Loss</span>
                    <span className="text-warning font-medium">
                      -{results.avgLoss.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2">Strategy Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    {results.winRate > 60 ? 'Excellent' : results.winRate > 50 ? 'Good' : 'Needs Improvement'} 
                    {' '}strategy with {results.totalTrades} trades executed over the selected period.
                    {results.profitFactor > 1.5 ? ' High profit factor indicates strong performance.' : ' Consider optimizing for better profit factor.'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategyTester;