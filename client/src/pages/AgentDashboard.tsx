import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, Eye, BrainCircuit, Zap, Plus, RefreshCw, AlertTriangle } from 'lucide-react';

export function AgentDashboard() {
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicCode, setNewTopicCode] = useState('');

  // Fetch status
  const statusQuery = trpc.agent.getStatus.useQuery(undefined, { refetchInterval: 5000 });
  const logsQuery = trpc.agent.getLogs.useQuery(undefined, { refetchInterval: 2000 });
  
  const addWatchlistMut = trpc.agent.addToWatchlist.useMutation({
    onSuccess: () => {
      setNewTopicName('');
      setNewTopicCode('');
      statusQuery.refetch();
    }
  });

  const triggerObservationMut = trpc.agent.triggerObservation.useMutation();

  const handleAddTopic = () => {
    if (newTopicName && newTopicCode) {
      addWatchlistMut.mutate({ name: newTopicName, code: newTopicCode });
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            Multi-Agent Control Center
          </h1>
          <p className="text-muted-foreground mt-1">Monitor autonomous AI agents running in the background.</p>
        </div>
        <Button 
          onClick={() => triggerObservationMut.mutate()} 
          disabled={triggerObservationMut.isPending}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${triggerObservationMut.isPending ? 'animate-spin' : ''}`} />
          Force Observation Cycle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Agents Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Active Agents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Observer Agent</p>
                  <p className="text-xs text-muted-foreground">Scans watchlist periodically</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Online</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Analyst Agent</p>
                  <p className="text-xs text-muted-foreground">Processes Event Vectors</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Online</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Action Agent</p>
                  <p className="text-xs text-muted-foreground">Fires alerts & reports</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Online</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Watchlist */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Observer Watchlist</CardTitle>
            <CardDescription>Topics the Observer Agent is actively monitoring.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {statusQuery.data?.watchlist.map((item: any) => (
                <Badge key={item.code} variant="secondary" className="px-3 py-1 text-sm">
                  {item.name} ({item.code})
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 items-center bg-muted/50 p-3 rounded-lg border">
              <Input 
                placeholder="Topic Name (e.g. Gold)" 
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="bg-background"
              />
              <Input 
                placeholder="Code (e.g. GLD)" 
                value={newTopicCode}
                onChange={(e) => setNewTopicCode(e.target.value)}
                className="bg-background w-32"
              />
              <Button onClick={handleAddTopic} disabled={addWatchlistMut.isPending || !newTopicName}>
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Live Logs */}
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Live Agent Terminal Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg h-96 overflow-y-auto space-y-2">
              {logsQuery.data?.length === 0 ? (
                <p className="text-muted-foreground">Waiting for agent activity...</p>
              ) : (
                logsQuery.data?.map((log) => (
                  <div key={log.id} className="border-b border-green-900/30 pb-1">
                    <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                    <span className={
                      log.agent === 'Action' ? 'text-orange-400 font-bold' : 
                      log.agent === 'Analyst' ? 'text-purple-400' : 'text-blue-400'
                    }>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
