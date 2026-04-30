import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Key, Copy, AlertCircle, Trash2, Plus, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ApiManagement() {
  const [newKey, setNewKey] = useState<string | null>(null);

  // Fetch API keys
  const { data: keys = [], refetch, isLoading } = trpc.subscription.getUserApiKeys.useQuery();

  // Mutations
  const generateMutation = trpc.subscription.generateApiKey.useMutation({
    onSuccess: (data) => {
      setNewKey(data.key);
      toast.success('API Key generated successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const revokeMutation = trpc.subscription.revokeApiKey.useMutation({
    onSuccess: () => {
      toast.success('API Key revoked successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Developer API
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your API keys to integrate AmalSense engine into your own applications.
          </p>
        </div>
        <Button 
          onClick={() => generateMutation.mutate()} 
          disabled={generateMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {generateMutation.isPending ? 'Generating...' : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Generate New Key
            </>
          )}
        </Button>
      </div>

      {newKey && (
        <Alert className="mb-8 border-green-500/50 bg-green-500/10">
          <Terminal className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Key Generated Successfully!</AlertTitle>
          <AlertDescription>
            <p className="mb-3">Please copy this key immediately. You won't be able to see it again.</p>
            <div className="flex items-center gap-2 bg-background p-3 rounded border border-border/50">
              <code className="flex-1 font-mono text-sm break-all">{newKey}</code>
              <Button size="icon" variant="ghost" onClick={() => copyToClipboard(newKey)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setNewKey(null)}>
              I have saved it
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-500" />
            Active API Keys
          </CardTitle>
          <CardDescription>
            Keys allow full programmatic access to your subscription limits. Do not share them publicly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground animate-pulse">
              Loading keys...
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12 border rounded-lg border-dashed bg-muted/20">
              <Key className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No API Keys Found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Generate your first key to start using the AmalSense API.
              </p>
              <Button onClick={() => generateMutation.mutate()} variant="outline">
                Generate Key
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <div key={key.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-background hover:border-blue-500/30 transition-colors gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="font-mono bg-muted px-2 py-1 rounded text-sm">
                        {key.partialKey}
                      </code>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Active
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(key.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex flex-col items-start md:items-end">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Usage</span>
                      <span className="text-sm font-medium">
                        {key.usage.toLocaleString()} <span className="text-muted-foreground">/ {key.limit.toLocaleString()}</span>
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm('Are you sure you want to revoke this key? Any applications using it will stop working immediately.')) {
                          revokeMutation.mutate({ keyId: key.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-8 border-border/50 bg-blue-950/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Quick Start Example
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black/50 p-4 rounded-md border border-white/10 overflow-x-auto">
            <pre className="text-sm text-green-400 font-mono">
{`curl -X POST https://api.amaalsense.com/v1/analyze \\
  -H "Authorization: Bearer amal_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "global economic shift", "depth": "deep"}'`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
