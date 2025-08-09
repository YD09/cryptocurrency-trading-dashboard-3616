import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Settings() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your trading preferences and account settings</p>
      </div>
      
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              User preferences, API keys, notification settings, and account management features.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}