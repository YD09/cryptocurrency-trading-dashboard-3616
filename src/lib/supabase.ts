import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pejnrpfnmsdeapgyuqhj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock Supabase client for development if no key is provided
const createMockSupabase = () => {
  // Get mock data from localStorage or initialize empty
  const getMockData = () => {
    const stored = localStorage.getItem('mock-supabase-data');
    return stored ? JSON.parse(stored) : {
      strategies: [],
      trades: [],
      portfolios: [],
      backtestResults: []
    };
  };

  // Save mock data to localStorage
  const saveMockData = (data: any) => {
    localStorage.setItem('mock-supabase-data', JSON.stringify(data));
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ 
        data: { user: { id: 'mock-user-id', email: 'dev@example.com' } }, 
        error: null 
      }),
      signInWithPassword: async (credentials: any) => ({ 
        data: { user: { id: 'mock-user-id', email: credentials.email }, session: { user: { id: 'mock-user-id', email: credentials.email } } }, 
        error: null 
      }),
      signUp: async (credentials: any) => ({ 
        data: { user: { id: 'mock-user-id', email: credentials.email }, session: { user: { id: 'mock-user-id', email: credentials.email } } }, 
        error: null 
      }),
      signInWithOtp: async (params: any) => ({ 
        data: { user: null }, 
        error: null 
      }),
      verifyOtp: async (params: any) => ({ 
        data: { user: { id: 'mock-user-id', phone: params.phone } }, 
        error: null 
      }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback: any) => ({
        data: { subscription: { unsubscribe: () => {} } }
      }),
      // --- Added for OAuth and password reset support in mock ---
      signInWithOAuth: async (params: any) => ({ data: { user: null }, error: null }),
      resetPasswordForEmail: async (email: string) => ({ data: null, error: null }),
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            const mockData = getMockData();
            const data = mockData[table as keyof typeof mockData]?.find((item: any) => item[column] === value);
            return { data, error: null };
          },
          order: (column: string, options: any) => {
            const mockData = getMockData();
            return {
              data: mockData[table as keyof typeof mockData] || [],
              error: null
            };
          }
        }),
        order: (column: string, options: any) => {
          const mockData = getMockData();
          return {
            data: mockData[table as keyof typeof mockData] || [],
            error: null
          };
        }
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            const mockData = getMockData();
            const newItem = {
              id: `mock-${table}-${Date.now()}`,
              ...data,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            mockData[table as keyof typeof mockData].push(newItem);
            saveMockData(mockData);
            console.log(`✅ Mock ${table} created:`, newItem);
            return { data: newItem, error: null };
          }
        })
      }),
      update: (data: any) => ({
        eq: async (column: string, value: any) => {
          const mockData = getMockData();
          const index = mockData[table as keyof typeof mockData]?.findIndex((item: any) => item[column] === value);
          if (index !== -1) {
            mockData[table as keyof typeof mockData][index] = {
              ...mockData[table as keyof typeof mockData][index],
              ...data,
              updated_at: new Date().toISOString()
            };
            saveMockData(mockData);
            console.log(`✅ Mock ${table} updated:`, mockData[table as keyof typeof mockData][index]);
          }
          return { error: null };
        }
      }),
      upsert: async (data: any) => {
        const mockData = getMockData();
        const existingIndex = mockData[table as keyof typeof mockData]?.findIndex((item: any) => item.user_id === data.user_id);
        if (existingIndex !== -1) {
          mockData[table as keyof typeof mockData][existingIndex] = {
            ...mockData[table as keyof typeof mockData][existingIndex],
            ...data,
            updated_at: new Date().toISOString()
          };
        } else {
          const newItem = {
            id: `mock-${table}-${Date.now()}`,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          mockData[table as keyof typeof mockData].push(newItem);
        }
        saveMockData(mockData);
        console.log(`✅ Mock ${table} upserted:`, data);
        return { error: null };
      },
      delete: () => ({
        eq: async (column: string, value: any) => {
          const mockData = getMockData();
          const index = mockData[table as keyof typeof mockData]?.findIndex((item: any) => item[column] === value);
          if (index !== -1) {
            mockData[table as keyof typeof mockData].splice(index, 1);
            saveMockData(mockData);
            console.log(`✅ Mock ${table} deleted:`, value);
          }
          return { error: null };
        }
      })
    })
  };
};

export const supabase = supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase();

// Database types
export interface User {
  id: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface Strategy {
  id: string;
  user_id: string;
  name: string;
  symbol: string;
  type: 'inside_candle' | 'ma_crossover' | 'breakout' | 'custom' | 'saved';
  conditions: string;
  enabled: boolean;
  lastSignal?: string;
  signalCount: number;
  created_at: string;
  updated_at: string;
}

export interface BacktestResult {
  id: string;
  user_id: string;
  strategy_id?: string;
  symbol: string;
  timeframe: string;
  start_date: string;
  end_date: string;
  totalTrades: number;
  winRate: number;
  totalReturn: number;
  maxDrawdown: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  created_at: string;
}

export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  openPrice: number;
  currentPrice: number;
  openTime: Date;
  closeTime?: Date;
  pnl: number;
  pnlPercent: number;
  status: 'OPEN' | 'CLOSED';
  stopLoss?: number;
  takeProfit?: number;
  closePrice?: number;
  finalPnl?: number;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  initialBalance: number;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  pnl: number;
  totalProfit: number;
  totalLoss: number;
  created_at: string;
  updated_at: string;
} 