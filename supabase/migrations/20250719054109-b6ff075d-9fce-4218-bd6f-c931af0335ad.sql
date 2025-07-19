-- Create enum for trade types
CREATE TYPE public.trade_type AS ENUM ('BUY', 'SELL');

-- Create enum for order types  
CREATE TYPE public.order_type AS ENUM ('MARKET', 'LIMIT', 'STOP_LOSS', 'TAKE_PROFIT');

-- Create enum for trade status
CREATE TYPE public.trade_status AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- Create user_portfolio table for portfolio summary
CREATE TABLE public.user_portfolio (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    total_capital DECIMAL(15,2) NOT NULL DEFAULT 1000000.00, -- ₹10,00,000 (10 lakh)
    available_balance DECIMAL(15,2) NOT NULL DEFAULT 1000000.00,
    invested_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    current_value DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_pnl DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    day_pnl DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_trades INTEGER NOT NULL DEFAULT 0,
    winning_trades INTEGER NOT NULL DEFAULT 0,
    losing_trades INTEGER NOT NULL DEFAULT 0,
    max_drawdown DECIMAL(10,4) NOT NULL DEFAULT 0.00,
    roi_percentage DECIMAL(10,4) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_trades table for trade history
CREATE TABLE public.user_trades (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    trade_type public.trade_type NOT NULL,
    order_type public.order_type NOT NULL,
    quantity INTEGER NOT NULL,
    entry_price DECIMAL(15,4) NOT NULL,
    exit_price DECIMAL(15,4),
    amount DECIMAL(15,2) NOT NULL,
    stop_loss DECIMAL(15,4),
    take_profit DECIMAL(15,4),
    status public.trade_status NOT NULL DEFAULT 'OPEN',
    realized_pnl DECIMAL(15,2) DEFAULT 0.00,
    unrealized_pnl DECIMAL(15,2) DEFAULT 0.00,
    entry_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    exit_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_positions table for current open positions
CREATE TABLE public.user_positions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    average_price DECIMAL(15,4) NOT NULL,
    current_price DECIMAL(15,4) NOT NULL,
    invested_amount DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL,
    unrealized_pnl DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    day_pnl DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, symbol)
);

-- Enable Row Level Security
ALTER TABLE public.user_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_positions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_portfolio
CREATE POLICY "Users can view their own portfolio" 
ON public.user_portfolio 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own portfolio" 
ON public.user_portfolio 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolio" 
ON public.user_portfolio 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for user_trades
CREATE POLICY "Users can view their own trades" 
ON public.user_trades 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trades" 
ON public.user_trades 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades" 
ON public.user_trades 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for user_positions
CREATE POLICY "Users can view their own positions" 
ON public.user_positions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own positions" 
ON public.user_positions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own positions" 
ON public.user_positions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own positions" 
ON public.user_positions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_portfolio_updated_at
    BEFORE UPDATE ON public.user_portfolio
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_trades_updated_at
    BEFORE UPDATE ON public.user_trades
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_positions_updated_at
    BEFORE UPDATE ON public.user_positions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_trades_user_id ON public.user_trades(user_id);
CREATE INDEX idx_user_trades_symbol ON public.user_trades(symbol);
CREATE INDEX idx_user_trades_status ON public.user_trades(status);
CREATE INDEX idx_user_positions_user_id ON public.user_positions(user_id);
CREATE INDEX idx_user_positions_symbol ON public.user_positions(symbol);
CREATE INDEX idx_user_portfolio_user_id ON public.user_portfolio(user_id);