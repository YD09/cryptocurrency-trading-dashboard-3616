import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Maximize2,
  Volume2,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const chartData = [
  { time: '09:00', price: 43250, volume: 1250000 },
  { time: '09:30', price: 43180, volume: 980000 },
  { time: '10:00', price: 43420, volume: 1500000 },
  { time: '10:30', price: 43380, volume: 1100000 },
  { time: '11:00', price: 43650, volume: 1800000 },
  { time: '11:30', price: 43720, volume: 1300000 },
  { time: '12:00', price: 43580, volume: 950000 },
];

const openPositions = [
  { id: 1, symbol: 'BTCUSDT', type: 'LONG', size: 0.1, entryPrice: 43250, currentPrice: 43580, pnl: 33.0 },
  { id: 2, symbol: 'ETHUSDT', type: 'SHORT', size: 2.5, entryPrice: 2650, currentPrice: 2625, pnl: 62.5 },
];

const openOrders = [
  { id: 1, symbol: 'BTCUSDT', type: 'BUY LIMIT', size: 0.05, price: 43000, status: 'PENDING' },
  { id: 2, symbol: 'ADAUSDT', type: 'SELL STOP', size: 1000, price: 0.480, status: 'PENDING' },
];

export default function Trading() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [orderType, setOrderType] = useState('market');
  const [orderSide, setOrderSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Trading</h1>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                <SelectItem value="ADAUSDT">ADA/USDT</SelectItem>
                <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">$43,580.00</span>
              <Badge variant="default" className="bg-green-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2.34%
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Chart Settings
            </Button>
            <Button variant="outline" size="sm">
              <Maximize2 className="mr-2 h-4 w-4" />
              Fullscreen
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chart Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedSymbol} Chart</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">1m</Button>
                    <Button variant="outline" size="sm">5m</Button>
                    <Button variant="default" size="sm">15m</Button>
                    <Button variant="outline" size="sm">1h</Button>
                    <Button variant="outline" size="sm">4h</Button>
                    <Button variant="outline" size="sm">1d</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'price' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                        name === 'price' ? 'Price' : 'Volume'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Positions and Orders */}
          <div className="border-t border-border p-4">
            <Tabs defaultValue="positions">
              <TabsList>
                <TabsTrigger value="positions">Positions ({openPositions.length})</TabsTrigger>
                <TabsTrigger value="orders">Orders ({openOrders.length})</TabsTrigger>
                <TabsTrigger value="history">Trade History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="positions" className="mt-4">
                <div className="space-y-2">
                  {openPositions.map((position) => (
                    <div key={position.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <Badge variant={position.type === 'LONG' ? 'default' : 'secondary'}>
                          {position.type}
                        </Badge>
                        <div>
                          <p className="font-medium">{position.symbol}</p>
                          <p className="text-sm text-muted-foreground">Size: {position.size}</p>
                        </div>
                        <div>
                          <p className="text-sm">Entry: ${position.entryPrice.toFixed(2)}</p>
                          <p className="text-sm">Current: ${position.currentPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className={`font-medium ${position.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {position.pnl > 0 ? '+' : ''}${position.pnl.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">P&L</p>
                        </div>
                        <Button variant="outline" size="sm">Close</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-4">
                <div className="space-y-2">
                  {openOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{order.status}</Badge>
                        <div>
                          <p className="font-medium">{order.symbol}</p>
                          <p className="text-sm text-muted-foreground">{order.type}</p>
                        </div>
                        <div>
                          <p className="text-sm">Size: {order.size}</p>
                          <p className="text-sm">Price: ${order.price.toFixed(3)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Modify</Button>
                        <Button variant="destructive" size="sm">Cancel</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <p className="text-muted-foreground">Trade history will appear here...</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Order Panel */}
        <div className="w-80 border-l border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Place Order</h2>
          </div>
          
          <div className="flex-1 p-4 space-y-4">
            {/* Order Type */}
            <Tabs value={orderSide} onValueChange={setOrderSide}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy" className="text-green-600">Buy</TabsTrigger>
                <TabsTrigger value="sell" className="text-red-600">Sell</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Order Type Selection */}
            <div>
              <Label>Order Type</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                  <SelectItem value="stop">Stop</SelectItem>
                  <SelectItem value="stop-limit">Stop Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <Label>Quantity</Label>
              <Input 
                type="number" 
                placeholder="0.0" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {/* Price (for limit orders) */}
            {orderType !== 'market' && (
              <div>
                <Label>Price</Label>
                <Input 
                  type="number" 
                  placeholder="0.00" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            )}

            {/* Quick Amount Buttons */}
            <div>
              <Label>Quick Amount</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => setQuantity('0.001')}>
                  25%
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuantity('0.002')}>
                  50%
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuantity('0.003')}>
                  75%
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuantity('0.004')}>
                  Max
                </Button>
              </div>
            </div>

            <Separator />

            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Available Balance:</span>
                <span>$25,430.50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Est. Cost:</span>
                <span>$4,358.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Commission:</span>
                <span>$4.36</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              className={`w-full ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              size="lg"
            >
              {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedSymbol}
            </Button>
          </div>

          {/* Account Info */}
          <div className="border-t border-border p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Account Balance:</span>
                <span className="font-medium">$107,200.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Available Margin:</span>
                <span className="font-medium">$89,450.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Used Margin:</span>
                <span className="font-medium">$17,750.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}