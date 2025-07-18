import { useState, useEffect } from 'react';
import { Plus, Play, Pause, Trash2, Bell, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Strategy {
  id: string;
  name: string;
  symbol: string;
  type: 'inside_candle' | 'ma_crossover' | 'breakout' | 'custom';
  conditions: string;
  enabled: boolean;
  lastSignal?: string;
  signalCount: number;
}

const StrategyManager = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    symbol: '',
    type: 'inside_candle' as const,
    conditions: '',
    enabled: true,
  });
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockStrategies: Strategy[] = [
      {
        id: '1',
        name: 'Nifty Inside Candle',
        symbol: 'NIFTY50',
        type: 'inside_candle',
        conditions: 'Detect inside candle pattern on daily timeframe',
        enabled: true,
        lastSignal: '2024-01-15 09:45:00',
        signalCount: 5,
      },
      {
        id: '2',
        name: 'Bank Nifty MA Cross',
        symbol: 'BANKNIFTY',
        type: 'ma_crossover',
        conditions: '20 EMA crosses above 50 EMA on 15min timeframe',
        enabled: false,
        signalCount: 3,
      },
    ];
    setStrategies(mockStrategies);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrategy.name || !newStrategy.symbol) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const strategy: Strategy = {
      id: Date.now().toString(),
      ...newStrategy,
      signalCount: 0,
    };

    setStrategies([...strategies, strategy]);
    setNewStrategy({
      name: '',
      symbol: '',
      type: 'inside_candle',
      conditions: '',
      enabled: true,
    });
    setShowForm(false);
    
    toast({
      title: "Strategy Created",
      description: `${strategy.name} has been added successfully`,
    });
  };

  const toggleStrategy = (id: string) => {
    setStrategies(strategies.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const deleteStrategy = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
    toast({
      title: "Strategy Deleted",
      description: "Strategy has been removed successfully",
    });
  };

  const getStrategyTypeLabel = (type: string) => {
    switch (type) {
      case 'inside_candle': return 'Inside Candle';
      case 'ma_crossover': return 'MA Crossover';
      case 'breakout': return 'Breakout';
      case 'custom': return 'Custom';
      default: return type;
    }
  };

  const getStrategyTypeColor = (type: string) => {
    switch (type) {
      case 'inside_candle': return 'bg-primary';
      case 'ma_crossover': return 'bg-success';
      case 'breakout': return 'bg-warning';
      case 'custom': return 'bg-accent';
      default: return 'bg-muted';
    }
  };

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
                  <Input
                    value={newStrategy.symbol}
                    onChange={(e) => setNewStrategy({ ...newStrategy, symbol: e.target.value })}
                    placeholder="e.g., NIFTY50, RELIANCE"
                    className="bg-secondary/50 border-muted"
                  />
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
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Strategy Conditions
                </label>
                <Textarea
                  value={newStrategy.conditions}
                  onChange={(e) => setNewStrategy({ ...newStrategy, conditions: e.target.value })}
                  placeholder="Describe your strategy conditions..."
                  className="bg-secondary/50 border-muted h-24"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newStrategy.enabled}
                  onCheckedChange={(checked) => setNewStrategy({ ...newStrategy, enabled: checked })}
                />
                <label className="text-sm text-foreground">Enable strategy</label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
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