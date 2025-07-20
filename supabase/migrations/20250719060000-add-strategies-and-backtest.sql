-- Create strategies table
CREATE TABLE public.strategies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('inside_candle', 'ma_crossover', 'breakout', 'custom', 'saved')),
    conditions TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT false,
    lastSignal TIMESTAMP WITH TIME ZONE,
    signalCount INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create backtest_results table
CREATE TABLE public.backtest_results (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    strategy_id UUID REFERENCES public.strategies(id) ON DELETE CASCADE,
    symbol VARCHAR(50) NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    totalTrades INTEGER NOT NULL,
    winRate DECIMAL(5,2) NOT NULL,
    totalReturn DECIMAL(10,4) NOT NULL,
    maxDrawdown DECIMAL(10,4) NOT NULL,
    profitFactor DECIMAL(10,4) NOT NULL,
    avgWin DECIMAL(10,4) NOT NULL,
    avgLoss DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolios table (if not exists from previous migration)
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    initialBalance DECIMAL(15,2) NOT NULL DEFAULT 10000.00,
    balance DECIMAL(15,2) NOT NULL DEFAULT 10000.00,
    equity DECIMAL(15,2) NOT NULL DEFAULT 10000.00,
    margin DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    freeMargin DECIMAL(15,2) NOT NULL DEFAULT 10000.00,
    marginLevel DECIMAL(10,4) NOT NULL DEFAULT 0.00,
    pnl DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    totalProfit DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    totalLoss DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trades table (if not exists from previous migration)
CREATE TABLE IF NOT EXISTS public.trades (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    symbol VARCHAR(50) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('BUY', 'SELL')),
    volume DECIMAL(15,4) NOT NULL,
    openPrice DECIMAL(15,4) NOT NULL,
    currentPrice DECIMAL(15,4) NOT NULL,
    openTime TIMESTAMP WITH TIME ZONE NOT NULL,
    closeTime TIMESTAMP WITH TIME ZONE,
    pnl DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    pnlPercent DECIMAL(10,4) NOT NULL DEFAULT 0.00,
    status VARCHAR(10) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED')),
    stopLoss DECIMAL(15,4),
    takeProfit DECIMAL(15,4),
    closePrice DECIMAL(15,4),
    finalPnl DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backtest_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Create policies for strategies
CREATE POLICY "Users can view their own strategies" 
ON public.strategies 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own strategies" 
ON public.strategies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own strategies" 
ON public.strategies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own strategies" 
ON public.strategies 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for backtest_results
CREATE POLICY "Users can view their own backtest results" 
ON public.backtest_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own backtest results" 
ON public.backtest_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own backtest results" 
ON public.backtest_results 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own backtest results" 
ON public.backtest_results 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for portfolios
CREATE POLICY "Users can view their own portfolio" 
ON public.portfolios 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own portfolio" 
ON public.portfolios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio" 
ON public.portfolios 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for trades
CREATE POLICY "Users can view their own trades" 
ON public.trades 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trades" 
ON public.trades 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades" 
ON public.trades 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trades" 
ON public.trades 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_strategies_user_id ON public.strategies(user_id);
CREATE INDEX idx_strategies_type ON public.strategies(type);
CREATE INDEX idx_backtest_results_user_id ON public.backtest_results(user_id);
CREATE INDEX idx_backtest_results_strategy_id ON public.backtest_results(strategy_id);
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_trades_user_id ON public.trades(user_id);
CREATE INDEX idx_trades_symbol ON public.trades(symbol);
CREATE INDEX idx_trades_status ON public.trades(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_strategies_updated_at
    BEFORE UPDATE ON public.strategies
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
    BEFORE UPDATE ON public.trades
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column(); 