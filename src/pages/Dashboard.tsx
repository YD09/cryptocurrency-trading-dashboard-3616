import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Users,
  AlertTriangle,
  Plus,
  BarChart3,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock data for charts
const equityData = [
  { date: '2024-01-01', value: 100000 },
  { date: '2024-01-02', value: 101500 },
  { date: '2024-01-03', value: 99800 },
  { date: '2024-01-04', value: 102300 },
  { date: '2024-01-05', value: 104100 },
  { date: '2024-01-06', value: 103200 },
  { date: '2024-01-07', value: 105600 },
  { date: '2024-01-08', value: 107200 },
];

const performanceData = [
  { symbol: 'BTCUSDT', pnl: 2340.50, change: 2.34 },
  { symbol: 'ETHUSDT', pnl: -850.25, change: -1.20 },
  { symbol: 'ADAUSDT', pnl: 1250.00, change: 5.67 },
  { symbol: 'SOLUSDT', pnl: 780.30, change: 3.45 },
];

const recentTrades = [
  { id: 1, symbol: 'BTCUSDT', type: 'BUY', quantity: 0.1, price: 43250.00, time: '2 min ago', pnl: 125.50 },
  { id: 2, symbol: 'ETHUSDT', type: 'SELL', quantity: 2.5, price: 2650.00, time: '15 min ago', pnl: -45.20 },
  { id: 3, symbol: 'ADAUSDT', type: 'BUY', quantity: 1000, price: 0.485, time: '1 hour ago', pnl: 67.80 },
  { id: 4, symbol: 'SOLUSDT', type: 'SELL', quantity: 10, price: 98.50, time: '2 hours ago', pnl: 234.10 },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Overview of your trading performance</p>
          </div>
          <div className="flex space-x-3">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Strategy
            </Button>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$107,200.00</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +7.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+$7,200.00</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +2.4% this week
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68.5%</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +2.1% improvement
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  2 need attention
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Equity Curve */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={equityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Equity']} />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tables */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance by Symbol */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Symbol</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{item.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.change > 0 ? '+' : ''}{item.change}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${item.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.pnl > 0 ? '+' : ''}${item.pnl.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Trades */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant={trade.type === 'BUY' ? 'default' : 'secondary'}>
                          {trade.type}
                        </Badge>
                        <div>
                          <p className="font-medium">{trade.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {trade.quantity} @ ${trade.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${trade.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">{trade.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}