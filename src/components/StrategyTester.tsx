import { useState, useEffect } from 'react';
import { Play, BarChart3, TrendingUp, TrendingDown, DollarSign, Save, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase, BacktestResult } from '@/lib/supabase';
import StockSearchBar from './StockSearchBar';

interface BacktestResultLocal {
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
  const [results, setResults] = useState<BacktestResultLocal | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const { toast } = useToast();

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
    if (!symbol || !strategy) {
      toast({
        title: "Error",
        description: "Please select a symbol and enter strategy code",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunning(true);
    
    // Simulate backtest execution
    setTimeout(() => {
      const mockResults: BacktestResultLocal = {
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

  const handleSaveStrategy = async () => {
    if (!strategyName || !strategyDescription) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (wordCount > 100) {
      toast({
        title: "Error",
        description: "Strategy description must be 100 words or less",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // For development mode, create a mock user if not authenticated
      let userId = user?.id;
      if (!userId) {
        userId = 'dev-user-' + Date.now();
        console.log('Development mode: Using mock user ID:', userId);
      }

      // Save strategy (or mock if no real user)
      let strategyData;
      if (user) {
        const { data, error: strategyError } = await supabase
          .from('strategies')
          .insert({
            user_id: user.id,
            name: strategyName,
            symbol: symbol,
            type: 'saved',
            conditions: strategyDescription,
            enabled: false,
            signalCount: 0,
          })
          .select()
          .single();

        if (strategyError) {
          console.error('Supabase strategy error:', strategyError);
          throw new Error(`Strategy save error: ${strategyError.message}`);
        }
        strategyData = data;
        console.log('Strategy saved to Supabase:', strategyData);
      } else {
        // Mock strategy data for development
        strategyData = {
          id: 'mock-strategy-' + Date.now(),
          user_id: userId,
          name: strategyName,
          symbol: symbol,
          type: 'saved',
          conditions: strategyDescription,
          enabled: false,
          signalCount: 0,
          created_at: new Date().toISOString()
        };
        console.log('Development mode: Created mock strategy:', strategyData);
      }

      // Save backtest result (or mock if no real user)
      if (results) {
        if (user) {
          const { error: backtestError } = await supabase
            .from('backtest_results')
            .insert({
              user_id: user.id,
              strategy_id: strategyData.id,
              symbol: symbol,
              timeframe: timeframe,
              start_date: startDate,
              end_date: endDate,
              totalTrades: results.totalTrades,
              winRate: results.winRate,
              totalReturn: results.totalReturn,
              maxDrawdown: results.maxDrawdown,
              profitFactor: results.profitFactor,
              avgWin: results.avgWin,
              avgLoss: results.avgLoss,
            });

          if (backtestError) {
            console.error('Supabase backtest error:', backtestError);
            throw new Error(`Backtest save error: ${backtestError.message}`);
          }
          console.log('Backtest result saved to Supabase');
        } else {
          console.log('Development mode: Mock backtest result saved');
        }
      }

      setShowSaveDialog(false);
      setStrategyName('');
      setStrategyDescription('');
      setWordCount(0);
      
      toast({
        title: "Strategy Saved Successfully",
        description: "Strategy has been saved successfully",
      });
    } catch (error: any) {
      console.error('Strategy save error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save strategy. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setStrategyDescription(value);
    const words = value.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
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
                  <SelectContent className="glass-card border-muted backdrop-blur-md bg-background/80">
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
            {results ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{results.totalTrades}</div>
                    <div className="text-sm text-muted-foreground">Total Trades</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-success">{results.winRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className={`text-2xl font-bold ${results.totalReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {results.totalReturn >= 0 ? '+' : ''}{results.totalReturn.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Total Return</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-warning">{results.maxDrawdown.toFixed(2)}%</div>
                    <div className="text-sm text-muted-foreground">Max Drawdown</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">{results.profitFactor.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Profit Factor</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-success">{results.avgWin.toFixed(2)}%</div>
                    <div className="text-sm text-muted-foreground">Avg Win</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{results.avgLoss.toFixed(2)}%</div>
                  <div className="text-sm text-muted-foreground">Avg Loss</div>
                </div>

                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Save className="h-4 w-4 mr-2" />
                      Save Strategy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background border-muted">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Save Strategy</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="strategy-name" className="text-foreground">Strategy Name</Label>
                        <Input
                          id="strategy-name"
                          value={strategyName}
                          onChange={(e) => setStrategyName(e.target.value)}
                          placeholder="Enter strategy name"
                          className="bg-secondary/50 border-muted"
                        />
                      </div>
                      <div>
                        <Label htmlFor="strategy-description" className="text-foreground">
                          Strategy Description <span className="text-muted-foreground">({wordCount}/100 words)</span>
                        </Label>
                        <Textarea
                          id="strategy-description"
                          value={strategyDescription}
                          onChange={(e) => handleDescriptionChange(e.target.value)}
                          placeholder="Describe your strategy..."
                          className={`bg-secondary/50 border-muted h-24 ${wordCount > 100 ? 'border-red-500' : ''}`}
                        />
                        {wordCount > 100 && (
                          <p className="text-sm text-red-500 mt-1">
                            Strategy description must be 100 words or less
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleSaveStrategy} 
                          className="bg-primary hover:bg-primary/90"
                          disabled={wordCount > 100}
                        >
                          Save Strategy
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setShowSaveDialog(false)}
                          className="border-muted"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Run a backtest to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategyTester;