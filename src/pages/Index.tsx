import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockSearchBar from '@/components/StockSearchBar';
import TradingChart from '@/components/TradingChart';
import StrategyManager from '@/components/StrategyManager';
import SignalHistory from '@/components/SignalHistory';
import StrategyTester from '@/components/StrategyTester';
import MarketStats from "@/components/MarketStats";
import { VirtualTrading } from '@/components/VirtualTrading';

const Index = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Global Trading Platform</h1>
          <p className="text-muted-foreground">Live charts, strategy alerts, and backtesting for crypto, forex, commodities, and global markets</p>
        </header>

        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList className="bg-secondary/50 border border-muted">
            <TabsTrigger value="charts" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Live Charts
            </TabsTrigger>
            <TabsTrigger value="strategies" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Strategy Manager
            </TabsTrigger>
            <TabsTrigger value="signals" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Signal History
            </TabsTrigger>
            <TabsTrigger value="tester" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Strategy Tester
            </TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Virtual Trading
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <StockSearchBar onSymbolSelect={setSelectedSymbol} />
              <MarketStats />
            </div>
            <TradingChart symbol={selectedSymbol} height={600} />
          </TabsContent>

          <TabsContent value="strategies">
            <StrategyManager />
          </TabsContent>

          <TabsContent value="signals">
            <SignalHistory />
          </TabsContent>

          <TabsContent value="tester">
            <StrategyTester />
          </TabsContent>

          <TabsContent value="trading">
            <VirtualTrading selectedSymbol={selectedSymbol} currentPrice={43250} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;