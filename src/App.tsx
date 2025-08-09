import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Strategies from './pages/Strategies';
import Trading from './pages/Trading';
import Backtesting from './pages/Backtesting';
import Alerts from './pages/Alerts';
import Teams from './pages/Teams';
import Settings from './pages/Settings';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="trade-crafter-theme">
        <Router>
          <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/strategies" element={<Strategies />} />
                <Route path="/trading" element={<Trading />} />
                <Route path="/backtesting" element={<Backtesting />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
