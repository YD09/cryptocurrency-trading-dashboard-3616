import { useState, useEffect } from 'react';
import { Bell, TrendingUp, TrendingDown, Clock, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Signal {
  id: string;
  strategyName: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'ALERT';
  message: string;
  timestamp: string;
  price?: number;
  status: 'active' | 'expired' | 'executed';
}

const SignalHistory = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filter, setFilter] = useState<string>('all');

  // Mock signal data
  useEffect(() => {
    const mockSignals: Signal[] = [
      {
        id: '1',
        strategyName: 'Nifty Inside Candle',
        symbol: 'NIFTY50',
        type: 'ALERT',
        message: 'Inside Candle pattern detected on NIFTY at 09:45 AM',
        timestamp: '2024-01-15T09:45:00',
        price: 21850.50,
        status: 'active',
      },
      {
        id: '2',
        strategyName: 'Bank Nifty Breakout',
        symbol: 'BANKNIFTY',
        type: 'BUY',
        message: 'Breakout above resistance level detected',
        timestamp: '2024-01-15T10:15:00',
        price: 46750.25,
        status: 'executed',
      },
      {
        id: '3',
        strategyName: 'Reliance MA Cross',
        symbol: 'RELIANCE',
        type: 'SELL',
        message: '20 EMA crossed below 50 EMA - Bearish signal',
        timestamp: '2024-01-15T11:30:00',
        price: 2850.75,
        status: 'active',
      },
      {
        id: '4',
        strategyName: 'TCS Support Test',
        symbol: 'TCS',
        type: 'BUY',
        message: 'Support level hold confirmed with volume',
        timestamp: '2024-01-15T14:20:00',
        price: 3950.30,
        status: 'expired',
      },
      {
        id: '5',
        strategyName: 'Gold Momentum',
        symbol: 'GOLD',
        type: 'ALERT',
        message: 'Strong momentum detected in Gold futures',
        timestamp: '2024-01-15T15:45:00',
        price: 65850.00,
        status: 'active',
      },
    ];
    setSignals(mockSignals);
  }, []);

  const filteredSignals = signals.filter(signal => {
    if (filter === 'all') return true;
    if (filter === 'buy') return signal.type === 'BUY';
    if (filter === 'sell') return signal.type === 'SELL';
    if (filter === 'alert') return signal.type === 'ALERT';
    if (filter === 'active') return signal.status === 'active';
    return true;
  });

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'BUY':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'SELL':
        return <TrendingDown className="h-4 w-4 text-warning" />;
      case 'ALERT':
        return <Bell className="h-4 w-4 text-primary" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'BUY':
        return 'bg-success text-white';
      case 'SELL':
        return 'bg-warning text-white';
      case 'ALERT':
        return 'bg-primary text-white';
      default:
        return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success border-success/30';
      case 'executed':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'expired':
        return 'bg-muted/20 text-muted-foreground border-muted/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Signal History</h2>
          <p className="text-muted-foreground">Track your trading signals and alerts</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-secondary/50 border-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Signals</SelectItem>
              <SelectItem value="buy">Buy Signals</SelectItem>
              <SelectItem value="sell">Sell Signals</SelectItem>
              <SelectItem value="alert">Alerts</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSignals.map((signal) => (
          <Card key={signal.id} className="glass-card border-muted hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {getSignalIcon(signal.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{signal.strategyName}</h3>
                      <Badge className={getSignalColor(signal.type)}>
                        {signal.type}
                      </Badge>
                      <Badge variant="outline" className="border-muted text-muted-foreground">
                        {signal.symbol}
                      </Badge>
                    </div>
                    
                    <p className="text-foreground mb-3">{signal.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTimestamp(signal.timestamp)}</span>
                      </div>
                      {signal.price && (
                        <div className="font-medium text-foreground">
                          {formatPrice(signal.price)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className={getStatusColor(signal.status)}>
                    {signal.status.charAt(0).toUpperCase() + signal.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSignals.length === 0 && (
        <Card className="glass-card border-muted">
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Signals Found</h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'No trading signals have been generated yet' 
                : `No signals found for the selected filter: ${filter}`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SignalHistory;