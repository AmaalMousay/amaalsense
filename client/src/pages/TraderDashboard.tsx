import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, DollarSign, Brain } from 'lucide-react';

export default function TraderDashboard() {
  const [asset, setAsset] = useState('SPY');
  const [searchAsset, setSearchAsset] = useState('');

  // Fetch real-time indices from AmalSense Engine
  const { data: indices, isLoading: isLoadingIndices } = trpc.indices.getLatestIndices.useQuery();
  
  // Fetch historical indices for charts
  const { data: history } = trpc.indices.getHistoricalIndices.useQuery({ hoursBack: 24 });

  // Fetch real trader insights
  const { data: traderInsights, isLoading: isLoadingInsights } = trpc.engine.getTraderInsights.useQuery({ 
    asset 
  });

  const currentCFI = indices?.cfi || 50;
  const currentGMI = indices?.gmi || 50;
  
  // Logic to calculate trading edge (Alpha)
  const marketSentiment = currentCFI > 70 ? 'Extreme Fear' : currentCFI > 55 ? 'Fear' : currentCFI < 30 ? 'Extreme Greed' : currentCFI < 45 ? 'Greed' : 'Neutral';
  const isOversold = currentCFI > 75;
  const isOverbought = currentCFI < 25;
  const recommendation = isOversold ? 'Strong Buy (Contrarian)' : isOverbought ? 'Take Profits (Risk High)' : 'Monitor / Hold';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAsset) setAsset(searchAsset.toUpperCase());
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-400 flex items-center gap-2">
            <DollarSign className="h-8 w-8" /> Trader Alpha Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Leverage collective emotion and global fear indices to generate trading edge.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input 
            placeholder="Search Asset (e.g. BTC, AAPL)" 
            value={searchAsset}
            onChange={(e) => setSearchAsset(e.target.value)}
            className="w-64 bg-background/50"
          />
          <Button type="submit" variant="secondary">Analyze</Button>
        </form>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collective Fear Index (CFI)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {isLoadingIndices ? '...' : currentCFI}
              {currentCFI > 60 ? <TrendingUp className="h-5 w-5 text-red-500" /> : <TrendingDown className="h-5 w-5 text-green-500" />}
            </div>
            <p className={`text-xs mt-1 ${currentCFI > 60 ? 'text-red-400' : 'text-emerald-400'}`}>
              {marketSentiment}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Global Mood Index (GMI)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingIndices ? '...' : currentGMI}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall Market Positivity
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Action Signal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${isOversold ? 'text-emerald-400' : isOverbought ? 'text-red-400' : 'text-yellow-400'}`}>
              {recommendation}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on Contrarian Emotional Data
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/50 backdrop-blur-sm bg-blue-950/20 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-1">
              <Brain className="h-4 w-4" /> Selected Asset
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-300">
              {asset}
            </div>
            <p className="text-xs text-blue-400/70 mt-1">
              Monitoring social momentum
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/50 shadow-sm bg-card/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Market Fear vs Asset Volatility Correlation</CardTitle>
            <CardDescription>Real-time view of how global panic indices map to market movements</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCfi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(val) => new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  stroke="#666" 
                />
                <YAxis stroke="#666" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
                  labelFormatter={(val) => new Date(val).toLocaleString()}
                />
                <Area type="monotone" dataKey="cfi" name="Fear Index (CFI)" stroke="#ef4444" fillOpacity={1} fill="url(#colorCfi)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm bg-card/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Live Agent Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingInsights ? (
                  <div className="flex justify-center p-4"><Activity className="animate-spin h-6 w-6 text-muted-foreground" /></div>
                ) : (
                  traderInsights?.insights.map((insight) => (
                    <div 
                      key={insight.id}
                      className={`p-3 bg-${insight.color}-950/30 border border-${insight.color}-500/20 rounded-md`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-semibold text-${insight.color}-400`}>{insight.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm bg-card/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Trading Automations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <div className="font-medium text-sm">Buy Signal Webhook</div>
                    <div className="text-xs text-muted-foreground">Trigger when CFI &gt; 80</div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <div className="font-medium text-sm">Panic Alert (SMS)</div>
                    <div className="text-xs text-muted-foreground">Trigger when GMI drops 20%</div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
