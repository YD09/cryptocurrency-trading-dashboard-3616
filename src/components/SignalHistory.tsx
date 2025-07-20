import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, TrendingUp, TrendingDown, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Signal {
  id: string;
  strategyId: string;
  strategyName: string;
  symbol: string;
  signal: 'BUY' | 'SELL';
  price: number;
  timestamp: Date;
  executed: boolean;
  profit?: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
}

const SignalHistory = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSignals();
  }, []);

  const loadSignals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, using development mode');
        // Load mock signals for development
        const mockSignals: Signal[] = [
          {
            id: 'signal-1',
            strategyId: 'strategy-1',
            strategyName: 'BTC Breakout Strategy',
            symbol: 'BTCUSD',
            signal: 'BUY',
            price: 43250.75,
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            executed: true,
            profit: 1250.50,
            status: 'EXECUTED'
          },
          {
            id: 'signal-2',
            strategyId: 'strategy-2',
            strategyName: 'ETH MA Crossover',
            symbol: 'ETHUSD',
            signal: 'SELL',
            price: 2650.45,
            timestamp: new Date(Date.now() - 7200000), // 2 hours ago
            executed: false,
            status: 'PENDING'
          },
          {
            id: 'signal-3',
            strategyId: 'strategy-3',
            strategyName: 'Gold Support Breakout',
            symbol: 'XAUUSD',
            signal: 'BUY',
            price: 2045.32,
            timestamp: new Date(Date.now() - 10800000), // 3 hours ago
            executed: true,
            profit: -85.25,
            status: 'EXECUTED'
          }
        ];
        setSignals(mockSignals);
        setLoading(false);
        return;
      }

      // In production, load signals from database
      const { data: signalsData } = await supabase
        .from('signals')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false });

      if (signalsData) {
        const formattedSignals = signalsData.map(signal => ({
          id: signal.id,
          strategyId: signal.strategy_id,
          strategyName: signal.strategy_name,
          symbol: signal.symbol,
          signal: signal.signal,
          price: signal.price,
          timestamp: new Date(signal.timestamp),
          executed: signal.executed,
          profit: signal.profit,
          status: signal.status
        }));
        setSignals(formattedSignals);
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading signals:', error);
      setLoading(false);
    }
  };

  const executeSignal = async (signalId: string) => {
    try {
      setSignals(prev => prev.map(signal => 
        signal.id === signalId 
          ? { ...signal, executed: true, status: 'EXECUTED' as const }
          : signal
      ));

      toast({
        title: "Signal Executed",
        description: "Trading signal has been executed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to execute signal",
        variant: "destructive",
      });
    }
  };

  const cancelSignal = async (signalId: string) => {
    try {
      setSignals(prev => prev.map(signal => 
        signal.id === signalId 
          ? { ...signal, status: 'CANCELLED' as const }
          : signal
      ));

      toast({
        title: "Signal Cancelled",
        description: "Trading signal has been cancelled",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel signal",
        variant: "destructive",
      });
    }
  };

  const getSignalIcon = (signal: 'BUY' | 'SELL') => {
    return signal === 'BUY' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
      case 'EXECUTED':
        return <Badge variant="outline" className="text-green-500 border-green-500">Executed</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="text-red-500 border-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getProfitBadge = (profit?: number) => {
    if (profit === undefined) return null;
    return (
      <Badge variant={profit >= 0 ? "default" : "destructive"}>
        {profit >= 0 ? '+' : ''}{profit.toFixed(2)}%
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Signal History</h2>
          <p className="text-muted-foreground">Track all your trading signals and their performance</p>
        </div>
        <Card className="glass-card border-muted">
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading signals...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Signal History</h2>
        <p className="text-muted-foreground">Track all your trading signals and their performance</p>
      </div>

      <div className="grid gap-4">
        {signals.length > 0 ? (
          signals.map((signal) => (
            <Card key={signal.id} className="glass-card border-muted">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getSignalIcon(signal.signal)}
                      <h3 className="font-semibold text-foreground">{signal.strategyName}</h3>
                      <Badge variant="outline" className="border-muted text-muted-foreground">
                        {signal.symbol}
                      </Badge>
                      {getStatusBadge(signal.status)}
                      {getProfitBadge(signal.profit)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Signal:</span>
                        <div className={`font-medium ${signal.signal === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                          {signal.signal}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <div className="font-mono">${signal.price.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <div className="text-xs">{signal.timestamp.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div className="font-medium">{signal.status}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {signal.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => executeSignal(signal.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Execute
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelSignal(signal.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="glass-card border-muted">
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Signals Yet</h3>
              <p className="text-muted-foreground mb-4">
                Trading signals will appear here when your strategies detect market opportunities
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SignalHistory;