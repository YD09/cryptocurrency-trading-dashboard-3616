import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Alerts() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-6">
        <h1 className="text-3xl font-bold">Alerts</h1>
        <p className="text-muted-foreground">Manage your trading alerts and notifications</p>
      </div>
      
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Real-time alerts with email and web notifications for price movements and strategy signals.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}