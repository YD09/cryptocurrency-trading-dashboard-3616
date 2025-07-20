import { useState, useEffect } from 'react';
import { Plus, Play, Pause, Trash2, Bell, TrendingUp, Save, Search, Code, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase, Strategy } from '@/lib/supabase';
import StockSearchBar from './StockSearchBar';
import { checkAndSendSignals } from '@/lib/notifications';

const StrategyManager = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    symbol: '',
    type: 'inside_candle' as const,
    conditions: '',
    enabled: true,
    pineScript: '', // Add Pine Script field
  });
  const [wordCount, setWordCount] = useState(0);
  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const [showPineScript, setShowPineScript] = useState(false); // Add toggle for Pine Script
  const { toast } = useToast();

  // Load strategies from Supabase
  useEffect(() => {
    loadStrategies();
  }, []);

  // Monitor strategies for signals
  useEffect(() => {
    const signalInterval = setInterval(async () => {
      if (strategies.length > 0) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await checkAndSendSignals(strategies, user.email || 'dev@example.com');
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(signalInterval);
  }, [strategies]);

  const loadStrategies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStrategies(data || []);
    } catch (error: any) {
      console.error('Error loading strategies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrategy.name || !newStrategy.symbol || !newStrategy.conditions) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to create strategies",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('strategies')
        .insert({
          user_id: user.id,
          name: newStrategy.name,
          symbol: newStrategy.symbol,
          type: newStrategy.type,
          conditions: newStrategy.conditions,
          enabled: newStrategy.enabled,
          signalCount: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setStrategies([data, ...strategies]);
      setNewStrategy({
        name: '',
        symbol: '',
        type: 'inside_candle',
        conditions: '',
        enabled: true,
        pineScript: '',
      });
      setWordCount(0);
      setShowForm(false);
      
      toast({
        title: "Strategy Created",
        description: `${data.name} has been added successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleStrategy = async (id: string) => {
    try {
      const updatedStrategies = strategies.map(s => 
        s.id === id ? { ...s, enabled: !s.enabled } : s
      );
      setStrategies(updatedStrategies);

      const { error } = await supabase
        .from('strategies')
        .update({ enabled: !strategies.find(s => s.id === id)?.enabled })
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteStrategy = async (id: string) => {
    try {
      const { error } = await supabase
        .from('strategies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStrategies(strategies.filter(s => s.id !== id));
      toast({
        title: "Strategy Deleted",
        description: "Strategy has been removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStrategyTypeLabel = (type: string) => {
    switch (type) {
      case 'inside_candle': return 'Inside Candle';
      case 'ma_crossover': return 'MA Crossover';
      case 'breakout': return 'Breakout';
      case 'custom': return 'Custom';
      case 'saved': return 'Saved Strategy';
      default: return type;
    }
  };

  const handleSymbolSelect = (selectedSymbol: string) => {
    setNewStrategy({ ...newStrategy, symbol: selectedSymbol });
    setShowSymbolSearch(false);
  };

  const getStrategyTypeColor = (type: string) => {
    switch (type) {
      case 'inside_candle': return 'bg-primary';
      case 'ma_crossover': return 'bg-success';
      case 'breakout': return 'bg-warning';
      case 'custom': return 'bg-accent';
      case 'saved': return 'bg-purple-500';
      default: return 'bg-muted';
    }
  };

  const handleConditionsChange = (value: string) => {
    setNewStrategy({ ...newStrategy, conditions: value });
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Strategy Manager</h2>
          <p className="text-muted-foreground">Create and manage your trading strategies</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Strategy
        </Button>
      </div>

      {showForm && (
        <Card className="glass-card border-muted">
          <CardHeader>
            <CardTitle className="text-foreground">Create New Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Strategy Name
                  </label>
                  <Input
                    value={newStrategy.name}
                    onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                    placeholder="e.g., Nifty Breakout Strategy"
                    className="bg-secondary/50 border-muted"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Symbol
                  </label>
                  <div className="relative">
                    <Input
                      value={newStrategy.symbol}
                      onChange={(e) => setNewStrategy({ ...newStrategy, symbol: e.target.value })}
                      onFocus={() => setShowSymbolSearch(true)}
                      placeholder="Search crypto, forex, stocks..."
                      className="bg-secondary/50 border-muted pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSymbolSearch(!showSymbolSearch)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  {showSymbolSearch && (
                    <div className="absolute z-50 w-full mt-1">
                      <StockSearchBar onSymbolSelect={handleSymbolSelect} />
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Strategy Type
                </label>
                <Select 
                  value={newStrategy.type} 
                  onValueChange={(value: any) => setNewStrategy({ ...newStrategy, type: value })}
                >
                  <SelectTrigger className="bg-secondary/50 border-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inside_candle">Inside Candle Pattern</SelectItem>
                    <SelectItem value="ma_crossover">Moving Average Crossover</SelectItem>
                    <SelectItem value="breakout">Breakout Strategy</SelectItem>
                    <SelectItem value="custom">Custom Strategy</SelectItem>
                    {strategies.length > 0 && (
                      <SelectItem value="saved" disabled>
                        -- Saved Strategies --
                      </SelectItem>
                    )}
                    {strategies.map((strategy) => (
                      <SelectItem key={strategy.id} value={`saved_${strategy.id}`}>
                        📋 {strategy.name} ({strategy.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Strategy Conditions <span className="text-muted-foreground">({wordCount}/100 words)</span>
                </label>
                <Textarea
                  value={newStrategy.conditions}
                  onChange={(e) => handleConditionsChange(e.target.value)}
                  placeholder="Describe your strategy conditions..."
                  className={`bg-secondary/50 border-muted h-24 ${wordCount > 100 ? 'border-red-500' : ''}`}
                />
                {wordCount > 100 && (
                  <p className="text-sm text-red-500 mt-1">
                    Strategy description must be 100 words or less
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">
                    Pine Script Code
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPineScript(!showPineScript)}
                    className="text-xs"
                  >
                    <Code className="h-3 w-3 mr-1" />
                    {showPineScript ? 'Hide' : 'Show'} Code
                  </Button>
                </div>
                {showPineScript && (
                  <>
                    <Textarea
                      value={newStrategy.pineScript}
                      onChange={(e) => setNewStrategy({ ...newStrategy, pineScript: e.target.value })}
                      placeholder="Enter your Pine Script code here..."
                      className="bg-secondary/50 border-muted h-32 font-mono text-sm"
                    />
                    <div className="mt-2">
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Quick Templates
                      </label>
                      <div className="grid gap-2">
                        {predefinedStrategies.map((template, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setNewStrategy({ ...newStrategy, pineScript: template.code })}
                            className="justify-start text-left border-muted hover:bg-muted/50"
                          >
                            {template.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newStrategy.enabled}
                  onCheckedChange={(checked) => setNewStrategy({ ...newStrategy, enabled: checked })}
                />
                <label className="text-sm text-foreground">Enable strategy</label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={wordCount > 100}>
                  Create Strategy
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="border-muted"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {strategies.map((strategy) => (
          <Card key={strategy.id} className="glass-card border-muted">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{strategy.name}</h3>
                    <Badge className={`${getStrategyTypeColor(strategy.type)} text-white`}>
                      {getStrategyTypeLabel(strategy.type)}
                    </Badge>
                    <Badge variant="outline" className="border-muted text-muted-foreground">
                      {strategy.symbol}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{strategy.conditions}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Bell className="h-4 w-4 text-warning" />
                      <span className="text-muted-foreground">
                        {strategy.signalCount} signals
                      </span>
                    </div>
                    {strategy.lastSignal && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-muted-foreground">
                          Last: {strategy.lastSignal}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={strategy.enabled}
                    onCheckedChange={() => toggleStrategy(strategy.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteStrategy(strategy.id)}
                    className="text-warning hover:text-warning/80 hover:bg-warning/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {strategies.length === 0 && (
        <Card className="glass-card border-muted">
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Strategies Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first trading strategy to start receiving alerts
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Strategy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StrategyManager;