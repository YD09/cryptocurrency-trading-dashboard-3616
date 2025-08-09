import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Teams() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border p-6">
        <h1 className="text-3xl font-bold">Teams</h1>
        <p className="text-muted-foreground">Collaborate with your team on shared trading accounts</p>
      </div>
      
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Team collaboration features with shared accounts, role-based permissions, and real-time sync.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}