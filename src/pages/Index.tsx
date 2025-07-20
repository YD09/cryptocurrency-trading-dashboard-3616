import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockSearchBar from '@/components/StockSearchBar';
import TradingChart from '@/components/TradingChart';
import StrategyManager from '@/components/StrategyManager';
import SignalHistory from '@/components/SignalHistory';
import StrategyTester from '@/components/StrategyTester';
import MarketStats from "@/components/MarketStats";
import { VirtualTrading } from '@/components/VirtualTrading';
import Auth from '@/components/Auth';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';

const Index = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAuthSuccess = () => {
    // Auth success is handled by the auth state listener
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Auth onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with user info */}
      <div className="bg-secondary/50 border-b border-muted p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trade Crafter</h1>
            <p className="text-muted-foreground">Live charts, strategy alerts, and backtesting for crypto, forex, commodities, and global markets</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-muted"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
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
    </div>
  );
};

export default Index;