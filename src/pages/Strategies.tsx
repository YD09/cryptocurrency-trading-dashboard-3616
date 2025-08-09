import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Code2,
  Play,
  Save,
  Upload,
  Download,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Editor from '@monaco-editor/react';

// Mock data for strategies
const strategies = [
  {
    id: 1,
    name: 'RSI Mean Reversion',
    description: 'Simple RSI-based mean reversion strategy for crypto markets',
    status: 'ACTIVE',
    lastModified: '2 hours ago',
    author: 'You',
    isPublic: false,
    performance: { return: 12.5, trades: 45, winRate: 68 }
  },
  {
    id: 2,
    name: 'Moving Average Crossover',
    description: 'Classic MA crossover strategy with risk management',
    status: 'PAUSED',
    lastModified: '1 day ago',
    author: 'You',
    isPublic: true,
    performance: { return: 8.3, trades: 28, winRate: 72 }
  },
  {
    id: 3,
    name: 'Bollinger Band Squeeze',
    description: 'Volatility breakout strategy using Bollinger Bands',
    status: 'DRAFT',
    lastModified: '3 days ago',
    author: 'You',
    isPublic: false,
    performance: { return: 0, trades: 0, winRate: 0 }
  },
];

const samplePineScript = `//@version=5
strategy("RSI Mean Reversion", overlay=true, default_qty_type=strategy.percent_of_equity, default_qty_value=10)

// Input parameters
length = input.int(14, "RSI Length")
oversold = input.int(30, "Oversold Level")
overbought = input.int(70, "Overbought Level")

// Calculate RSI
rsi = ta.rsi(close, length)

// Entry conditions
longCondition = rsi < oversold
shortCondition = rsi > overbought

// Entry orders
if longCondition
    strategy.entry("Long", strategy.long)

if shortCondition
    strategy.entry("Short", strategy.short)

// Exit conditions
if strategy.position_size > 0 and rsi > 50
    strategy.close("Long")

if strategy.position_size < 0 and rsi < 50
    strategy.close("Short")

// Plot RSI
plot(rsi, "RSI", color=color.blue)
hline(overbought, "Overbought", color=color.red)
hline(oversold, "Oversold", color=color.green)
hline(50, "Midline", color=color.gray)`;

export default function Strategies() {
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [code, setCode] = useState(samplePineScript);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         strategy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || strategy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-full">
      {/* Strategy List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Strategies</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Strategy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Strategy Name</Label>
                    <Input placeholder="Enter strategy name" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Describe your strategy" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Create Strategy</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search strategies..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PAUSED">Paused</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-2">
          {filteredStrategies.map((strategy) => (
            <Card 
              key={strategy.id} 
              className={`cursor-pointer transition-colors ${
                selectedStrategy.id === strategy.id ? 'border-primary' : ''
              }`}
              onClick={() => setSelectedStrategy(strategy)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium truncate">{strategy.name}</h3>
                      <Badge 
                        variant={
                          strategy.status === 'ACTIVE' ? 'default' :
                          strategy.status === 'PAUSED' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {strategy.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {strategy.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{strategy.lastModified}</span>
                      <span>{strategy.author}</span>
                    </div>
                    {strategy.performance.trades > 0 && (
                      <div className="flex items-center space-x-3 mt-2 text-xs">
                        <span className={strategy.performance.return > 0 ? 'text-green-600' : 'text-red-600'}>
                          {strategy.performance.return > 0 ? '+' : ''}{strategy.performance.return}%
                        </span>
                        <span>{strategy.performance.trades} trades</span>
                        <span>{strategy.performance.winRate}% win</span>
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{selectedStrategy.name}</h1>
              <p className="text-muted-foreground">{selectedStrategy.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button size="sm">
                <Play className="mr-2 h-4 w-4" />
                Run Backtest
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="editor" className="flex-1 flex flex-col">
          <div className="border-b border-border">
            <TabsList className="ml-4">
              <TabsTrigger value="editor">Pine Script Editor</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="editor" className="flex-1 m-0">
            <div className="h-full">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  renderLineHighlight: 'all',
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: 'line',
                  folding: true,
                  foldingHighlight: true,
                  foldingStrategy: 'indentation',
                  showFoldingControls: 'always',
                  lineNumbers: 'on',
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  glyphMargin: false,
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Strategy Parameters</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label>RSI Length</Label>
                  <Input type="number" defaultValue="14" />
                </div>
                <div>
                  <Label>Oversold Level</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div>
                  <Label>Overbought Level</Label>
                  <Input type="number" defaultValue="70" />
                </div>
                <div>
                  <Label>Stop Loss (%)</Label>
                  <Input type="number" defaultValue="2" />
                </div>
                <div>
                  <Label>Take Profit (%)</Label>
                  <Input type="number" defaultValue="4" />
                </div>
                <div>
                  <Label>Position Size (%)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
              </div>
              <Button>Update Parameters</Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Strategy Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Strategy Name</Label>
                    <Input defaultValue={selectedStrategy.name} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea defaultValue={selectedStrategy.description} />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select defaultValue={selectedStrategy.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="PAUSED">Paused</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked={selectedStrategy.isPublic} />
                    <Label>Make this strategy public</Label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Risk Management</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Max Drawdown (%)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div>
                    <Label>Daily Loss Limit (%)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div>
                    <Label>Max Open Positions</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                  <div>
                    <Label>Min Time Between Trades (min)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
              </div>

              <Button>Save Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}