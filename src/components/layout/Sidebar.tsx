import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  Code2,
  Bell,
  Users,
  Settings,
  Target,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    name: 'Trading',
    href: '/trading',
    icon: TrendingUp,
  },
  {
    name: 'Strategies',
    href: '/strategies',
    icon: Code2,
  },
  {
    name: 'Backtesting',
    href: '/backtesting',
    icon: Target,
  },
  {
    name: 'Alerts',
    href: '/alerts',
    icon: Bell,
  },
  {
    name: 'Teams',
    href: '/teams',
    icon: Users,
  },
];

const bottomNavigation = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Trade Crafter</h1>
            <p className="text-xs text-muted-foreground">Paper Trading Platform</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? 'secondary' : 'ghost'}
              asChild
              className={cn(
                'w-full justify-start',
                isActive && 'bg-secondary text-secondary-foreground'
              )}
            >
              <Link to={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom Navigation */}
      <div className="p-4 space-y-2">
        {bottomNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? 'secondary' : 'ghost'}
              asChild
              className={cn(
                'w-full justify-start',
                isActive && 'bg-secondary text-secondary-foreground'
              )}
            >
              <Link to={item.href}>
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          );
        })}
      </div>

      {/* Account Status */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Demo Account</p>
            <p className="text-xs text-muted-foreground">$100,000.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}