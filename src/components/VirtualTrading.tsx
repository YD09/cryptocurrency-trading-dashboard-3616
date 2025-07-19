import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, TrendingDown, DollarSign, PlusCircle, MinusCircle, Clock, Target, StopCircle } from 'lucide-react';

interface VirtualTradingProps {
  selectedSymbol: string;
  currentPrice?: number;
}

interface Trade {
  id: string;
  symbol: string;
  trade_type: 'BUY' | 'SELL';
  order_type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT';
  quantity: number;
  entry_price: number;
  exit_price?: number;
  amount: number;
  stop_loss?: number;
  take_profit?: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  realized_pnl?: number;
  unrealized_pnl?: number;
  entry_time: string;
  exit_time?: string;
}

interface Position {
  id: string;
  symbol: string;
  total_quantity: number;
  average_price: number;
  current_price: number;
  invested_amount: number;
  current_value: number;
  unrealized_pnl: number;
  day_pnl: number;
}

interface Portfolio {
  total_capital: number;
  available_balance: number;
  invested_amount: number;
  current_value: number;
  total_pnl: number;
  day_pnl: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  roi_percentage: number;
}

export const VirtualTrading = ({ selectedSymbol, currentPrice = 0 }: VirtualTradingProps) => {
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT'>('MARKET');
  const [inputType, setInputType] = useState<'quantity' | 'amount'>('quantity');
  const [quantity, setQuantity] = useState<number>(1);
  const [amount, setAmount] = useState<number>(1000);
  const [limitPrice, setLimitPrice] = useState<number>(currentPrice);
  const [stopLoss, setStopLoss] = useState<number | undefined>();
  const [takeProfit, setTakeProfit] = useState<number | undefined>();
  
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  useEffect(() => {
    if (currentPrice > 0) {
      setLimitPrice(currentPrice);
    }
  }, [currentPrice]);

  const fetchPortfolioData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use virtual trading.",
          variant: "destructive"
        });
        return;
      }

      // Fetch or create portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('user_portfolio')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (portfolioError && portfolioError.code !== 'PGRST116') {
        throw portfolioError;
      }

      if (!portfolioData) {
        // Create initial portfolio
        const { data: newPortfolio, error: createError } = await supabase
          .from('user_portfolio')
          .insert({
            user_id: user.id,
            total_capital: 1000000,
            available_balance: 1000000,
          })
          .select()
          .single();

        if (createError) throw createError;
        setPortfolio(newPortfolio);
      } else {
        setPortfolio(portfolioData);
      }

      // Fetch positions
      const { data: positionsData, error: positionsError } = await supabase
        .from('user_positions')
        .select('*')
        .eq('user_id', user.id);

      if (positionsError) throw positionsError;
      setPositions(positionsData || []);

      // Fetch trades
      const { data: tradesData, error: tradesError } = await supabase
        .from('user_trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tradesError) throw tradesError;
      setTrades(tradesData || []);

    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateQuantityFromAmount = () => {
    if (currentPrice > 0 && amount > 0) {
      return Math.floor(amount / currentPrice);
    }
    return 1;
  };

  const calculateAmountFromQuantity = () => {
    return quantity * (limitPrice || currentPrice);
  };

  const placeTrade = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const finalQuantity = inputType === 'amount' ? calculateQuantityFromAmount() : quantity;
      const finalAmount = inputType === 'quantity' ? calculateAmountFromQuantity() : amount;
      const finalPrice = orderType === 'MARKET' ? currentPrice : limitPrice;

      if (!portfolio || portfolio.available_balance < finalAmount) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough balance for this trade.",
          variant: "destructive"
        });
        return;
      }

      // Create trade record
      const { error: tradeError } = await supabase
        .from('user_trades')
        .insert({
          user_id: user.id,
          symbol: selectedSymbol,
          trade_type: tradeType,
          order_type: orderType,
          quantity: finalQuantity,
          entry_price: finalPrice,
          amount: finalAmount,
          stop_loss: stopLoss,
          take_profit: takeProfit,
          status: orderType === 'MARKET' ? 'OPEN' : 'OPEN' // For simplicity, all orders execute immediately
        });

      if (tradeError) throw tradeError;

      // Update or create position
      const existingPosition = positions.find(p => p.symbol === selectedSymbol);
      
      if (existingPosition) {
        // Update existing position
        const newQuantity = tradeType === 'BUY' 
          ? existingPosition.total_quantity + finalQuantity
          : existingPosition.total_quantity - finalQuantity;
        
        const newInvestedAmount = tradeType === 'BUY'
          ? existingPosition.invested_amount + finalAmount
          : existingPosition.invested_amount - finalAmount;

        const newAveragePrice = newQuantity > 0 ? newInvestedAmount / newQuantity : 0;

        if (newQuantity <= 0) {
          // Close position
          await supabase
            .from('user_positions')
            .delete()
            .eq('id', existingPosition.id);
        } else {
          // Update position
          await supabase
            .from('user_positions')
            .update({
              total_quantity: newQuantity,
              average_price: newAveragePrice,
              current_price: currentPrice,
              invested_amount: newInvestedAmount,
              current_value: newQuantity * currentPrice,
              unrealized_pnl: (newQuantity * currentPrice) - newInvestedAmount
            })
            .eq('id', existingPosition.id);
        }
      } else if (tradeType === 'BUY') {
        // Create new position for BUY
        await supabase
          .from('user_positions')
          .insert({
            user_id: user.id,
            symbol: selectedSymbol,
            total_quantity: finalQuantity,
            average_price: finalPrice,
            current_price: currentPrice,
            invested_amount: finalAmount,
            current_value: finalQuantity * currentPrice,
            unrealized_pnl: (finalQuantity * currentPrice) - finalAmount
          });
      }

      // Update portfolio
      const newAvailableBalance = tradeType === 'BUY' 
        ? portfolio.available_balance - finalAmount
        : portfolio.available_balance + finalAmount;

      await supabase
        .from('user_portfolio')
        .update({
          available_balance: newAvailableBalance,
          total_trades: portfolio.total_trades + 1
        })
        .eq('user_id', user.id);

      toast({
        title: "Trade Executed",
        description: `${tradeType} order for ${finalQuantity} shares of ${selectedSymbol} executed successfully.`,
      });

      // Refresh data
      fetchPortfolioData();
      setIsTradeModalOpen(false);
      resetTradeForm();

    } catch (error) {
      console.error('Error placing trade:', error);
      toast({
        title: "Trade Failed",
        description: "Failed to execute trade. Please try again.",
        variant: "destructive"
      });
    }
  };

  const resetTradeForm = () => {
    setQuantity(1);
    setAmount(1000);
    setStopLoss(undefined);
    setTakeProfit(undefined);
    setOrderType('MARKET');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading portfolio...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Capital</p>
              <p className="text-lg font-semibold">{formatCurrency(portfolio?.total_capital || 0)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-lg font-semibold text-green-600">{formatCurrency(portfolio?.available_balance || 0)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p className={`text-lg font-semibold ${(portfolio?.total_pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(portfolio?.total_pnl || 0)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">ROI</p>
              <p className={`text-lg font-semibold ${(portfolio?.roi_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(portfolio?.roi_percentage || 0).toFixed(2)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Button and Current Symbol */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Trade - {selectedSymbol}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-lg font-semibold">{formatCurrency(currentPrice)}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isTradeModalOpen} onOpenChange={setIsTradeModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <PlusCircle className="h-4 w-4 mr-2" />
                Place Trade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Place Trade - {selectedSymbol}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Trade Type */}
                <div className="flex gap-2">
                  <Button
                    variant={tradeType === 'BUY' ? 'default' : 'outline'}
                    onClick={() => setTradeType('BUY')}
                    className="flex-1"
                  >
                    BUY
                  </Button>
                  <Button
                    variant={tradeType === 'SELL' ? 'default' : 'outline'}
                    onClick={() => setTradeType('SELL')}
                    className="flex-1"
                  >
                    SELL
                  </Button>
                </div>

                {/* Order Type */}
                <div>
                  <Label>Order Type</Label>
                  <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKET">Market Order</SelectItem>
                      <SelectItem value="LIMIT">Limit Order</SelectItem>
                      <SelectItem value="STOP_LOSS">Stop Loss</SelectItem>
                      <SelectItem value="TAKE_PROFIT">Take Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Input Type Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={inputType === 'quantity' ? 'default' : 'outline'}
                    onClick={() => setInputType('quantity')}
                    className="flex-1"
                    size="sm"
                  >
                    Quantity
                  </Button>
                  <Button
                    variant={inputType === 'amount' ? 'default' : 'outline'}
                    onClick={() => setInputType('amount')}
                    className="flex-1"
                    size="sm"
                  >
                    Amount
                  </Button>
                </div>

                {/* Quantity/Amount Input */}
                {inputType === 'quantity' ? (
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Approx. Amount: {formatCurrency(calculateAmountFromQuantity())}
                    </p>
                  </div>
                ) : (
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Approx. Quantity: {formatNumber(calculateQuantityFromAmount())}
                    </p>
                  </div>
                )}

                {/* Limit Price (for non-market orders) */}
                {orderType !== 'MARKET' && (
                  <div>
                    <Label>Limit Price (₹)</Label>
                    <Input
                      type="number"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(Number(e.target.value))}
                      step="0.01"
                    />
                  </div>
                )}

                {/* Stop Loss */}
                <div>
                  <Label>Stop Loss (Optional)</Label>
                  <Input
                    type="number"
                    value={stopLoss || ''}
                    onChange={(e) => setStopLoss(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Enter stop loss price"
                    step="0.01"
                  />
                </div>

                {/* Take Profit */}
                <div>
                  <Label>Take Profit (Optional)</Label>
                  <Input
                    type="number"
                    value={takeProfit || ''}
                    onChange={(e) => setTakeProfit(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Enter take profit price"
                    step="0.01"
                  />
                </div>

                <Button onClick={placeTrade} className="w-full">
                  Execute {tradeType} Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Positions and Trades */}
      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="positions">Open Positions</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
          <TabsTrigger value="closed">Closed Trades</TabsTrigger>
        </TabsList>

        <TabsContent value="positions">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <p className="text-center text-muted-foreground">No open positions</p>
              ) : (
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div key={position.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{position.symbol}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(position.total_quantity)} shares @ {formatCurrency(position.average_price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${position.unrealized_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(position.unrealized_pnl)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(position.current_value)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              {trades.filter(t => t.status === 'OPEN').length === 0 ? (
                <p className="text-center text-muted-foreground">No recent trades</p>
              ) : (
                <div className="space-y-4">
                  {trades.filter(t => t.status === 'OPEN').map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={trade.trade_type === 'BUY' ? 'default' : 'secondary'}>
                          {trade.trade_type}
                        </Badge>
                        <div>
                          <h4 className="font-semibold">{trade.symbol}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(trade.quantity)} @ {formatCurrency(trade.entry_price)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(trade.amount)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(trade.entry_time).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closed">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Closed Trades</CardTitle>
            </CardHeader>
            <CardContent>
              {trades.filter(t => t.status === 'CLOSED').length === 0 ? (
                <p className="text-center text-muted-foreground">No closed trades</p>
              ) : (
                <div className="space-y-4">
                  {trades.filter(t => t.status === 'CLOSED').map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={trade.trade_type === 'BUY' ? 'default' : 'secondary'}>
                          {trade.trade_type}
                        </Badge>
                        <div>
                          <h4 className="font-semibold">{trade.symbol}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(trade.quantity)} @ {formatCurrency(trade.entry_price)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${(trade.realized_pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(trade.realized_pnl || 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {trade.exit_time ? new Date(trade.exit_time).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};