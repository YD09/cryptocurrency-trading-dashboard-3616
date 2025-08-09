import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Backtesting() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-6">
        <h1 className="text-3xl font-bold">Backtesting</h1>
        <p className="text-muted-foreground">Test your strategies against historical data</p>
      </div>
      
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Advanced backtesting features with performance analytics, equity curves, and risk metrics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}