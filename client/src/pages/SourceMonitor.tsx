/**
 * Source Monitor Page - Real-time API Health Dashboard
 * Shows the status of all data sources with live health checks
 */
import { useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle, XCircle, AlertTriangle, Wifi, WifiOff,
  RefreshCw, Clock, Activity, Globe, MessageSquare,
  Brain, Newspaper, Radio, Video, Send, Rss, Zap,
  ArrowLeft, Key
} from 'lucide-react';
import { Link } from 'wouter';

type SourceStatus = 'online' | 'degraded' | 'offline' | 'unknown' | 'no_key';

interface SourceHealthResult {
  name: string;
  id: string;
  status: SourceStatus;
  responseTimeMs: number;
  lastChecked: number;
  message: string;
  hasApiKey: boolean;
  quotaInfo?: {
    used: number;
    limit: number;
    remaining: number;
    resetAt?: string;
  };
  errorCount: number;
  successCount: number;
  uptime: number;
}

const sourceIcons: Record<string, React.ReactNode> = {
  newsapi: <Newspaper className="w-5 h-5" />,
  gnews: <Globe className="w-5 h-5" />,
  reddit: <MessageSquare className="w-5 h-5" />,
  mastodon: <Radio className="w-5 h-5" />,
  bluesky: <Zap className="w-5 h-5" />,
  youtube: <Video className="w-5 h-5" />,
  telegram: <Send className="w-5 h-5" />,
  groq: <Brain className="w-5 h-5" />,
  google_rss: <Rss className="w-5 h-5" />,
  builtin_llm: <Brain className="w-5 h-5" />,
};

const sourceCategories: Record<string, string> = {
  newsapi: 'News',
  gnews: 'News',
  google_rss: 'News',
  reddit: 'Social Media',
  mastodon: 'Social Media',
  bluesky: 'Social Media',
  telegram: 'Social Media',
  youtube: 'Video',
  groq: 'AI / LLM',
  builtin_llm: 'AI / LLM',
};

function getStatusColor(status: SourceStatus): string {
  switch (status) {
    case 'online': return 'text-emerald-400';
    case 'degraded': return 'text-amber-400';
    case 'offline': return 'text-red-400';
    case 'no_key': return 'text-gray-400';
    default: return 'text-gray-500';
  }
}

function getStatusBg(status: SourceStatus): string {
  switch (status) {
    case 'online': return 'bg-emerald-500/10 border-emerald-500/30';
    case 'degraded': return 'bg-amber-500/10 border-amber-500/30';
    case 'offline': return 'bg-red-500/10 border-red-500/30';
    case 'no_key': return 'bg-gray-500/10 border-gray-500/30';
    default: return 'bg-gray-500/10 border-gray-500/30';
  }
}

function getStatusBadge(status: SourceStatus) {
  switch (status) {
    case 'online':
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"><CheckCircle className="w-3 h-3 mr-1" /> Online</Badge>;
    case 'degraded':
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30"><AlertTriangle className="w-3 h-3 mr-1" /> Degraded</Badge>;
    case 'offline':
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"><XCircle className="w-3 h-3 mr-1" /> Offline</Badge>;
    case 'no_key':
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30"><Key className="w-3 h-3 mr-1" /> No Key</Badge>;
    default:
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30">Unknown</Badge>;
  }
}

function getResponseTimeColor(ms: number): string {
  if (ms === 0) return 'text-gray-500';
  if (ms < 500) return 'text-emerald-400';
  if (ms < 2000) return 'text-amber-400';
  return 'text-red-400';
}

function formatTime(timestamp: number): string {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function SourceCard({ source }: { source: SourceHealthResult }) {
  return (
    <Card className={`border ${getStatusBg(source.status)} transition-all hover:scale-[1.01]`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-black/20 ${getStatusColor(source.status)}`}>
              {sourceIcons[source.id] || <Activity className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{source.name}</h3>
              <p className="text-xs text-gray-400">{sourceCategories[source.id] || 'Other'}</p>
            </div>
          </div>
          {getStatusBadge(source.status)}
        </div>

        <p className="text-xs text-gray-300 mb-3 line-clamp-2">{source.message}</p>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <Clock className="w-3 h-3 mx-auto mb-1 text-gray-400" />
            <span className={`font-mono font-semibold ${getResponseTimeColor(source.responseTimeMs)}`}>
              {source.responseTimeMs}ms
            </span>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <Activity className="w-3 h-3 mx-auto mb-1 text-gray-400" />
            <span className="font-mono font-semibold text-blue-400">{source.uptime}%</span>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <Wifi className="w-3 h-3 mx-auto mb-1 text-gray-400" />
            <span className="font-mono font-semibold text-gray-300">
              {source.successCount}/{source.successCount + source.errorCount}
            </span>
          </div>
        </div>

        {source.quotaInfo && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Quota Usage</span>
              <span>{source.quotaInfo.remaining}/{source.quotaInfo.limit}</span>
            </div>
            <Progress
              value={((source.quotaInfo.limit - source.quotaInfo.remaining) / source.quotaInfo.limit) * 100}
              className="h-1.5"
            />
            {source.quotaInfo.resetAt && (
              <p className="text-[10px] text-gray-500 mt-1">Reset: {source.quotaInfo.resetAt}</p>
            )}
          </div>
        )}

        <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          Last checked: {formatTime(source.lastChecked)}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SourceMonitor() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: healthData, refetch, isLoading } = trpc.engine.getSourceHealth.useQuery(undefined, {
    refetchInterval: 60000, // Auto-refresh every 60 seconds
  });

  const refreshMutation = trpc.engine.refreshSourceHealth.useMutation({
    onSuccess: () => {
      refetch();
      setIsRefreshing(false);
    },
    onError: () => {
      setIsRefreshing(false);
    },
  });

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshMutation.mutate();
  }, [refreshMutation]);

  const sources = healthData?.sources || [];
  const onlineSources = sources.filter((s: SourceHealthResult) => s.status === 'online');
  const degradedSources = sources.filter((s: SourceHealthResult) => s.status === 'degraded');
  const offlineSources = sources.filter((s: SourceHealthResult) => s.status === 'offline');
  const noKeySources = sources.filter((s: SourceHealthResult) => s.status === 'no_key');

  // Group by category
  const newsSources = sources.filter((s: SourceHealthResult) => ['newsapi', 'gnews', 'google_rss'].includes(s.id));
  const socialSources = sources.filter((s: SourceHealthResult) => ['reddit', 'mastodon', 'bluesky', 'telegram'].includes(s.id));
  const aiSources = sources.filter((s: SourceHealthResult) => ['groq', 'builtin_llm'].includes(s.id));
  const videoSources = sources.filter((s: SourceHealthResult) => ['youtube'].includes(s.id));

  const avgResponseTime = sources.length > 0
    ? Math.round(sources.reduce((sum: number, s: SourceHealthResult) => sum + s.responseTimeMs, 0) / sources.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Source Monitor
              </h1>
              <p className="text-xs text-gray-400">Real-time API health monitoring</p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Checking...' : 'Refresh All'}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{sources.length}</div>
              <div className="text-xs text-gray-400">Total Sources</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{onlineSources.length}</div>
              <div className="text-xs text-emerald-400/70">Online</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{degradedSources.length}</div>
              <div className="text-xs text-amber-400/70">Degraded</div>
            </CardContent>
          </Card>
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{offlineSources.length + noKeySources.length}</div>
              <div className="text-xs text-red-400/70">Offline / No Key</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/5 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{avgResponseTime}ms</div>
              <div className="text-xs text-blue-400/70">Avg Response</div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Health Bar */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Overall Health</span>
              <span className="text-sm font-mono text-gray-400">
                {sources.length > 0 ? Math.round((onlineSources.length / sources.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden flex">
              {onlineSources.length > 0 && (
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${(onlineSources.length / sources.length) * 100}%` }}
                />
              )}
              {degradedSources.length > 0 && (
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${(degradedSources.length / sources.length) * 100}%` }}
                />
              )}
              {(offlineSources.length + noKeySources.length) > 0 && (
                <div
                  className="h-full bg-red-500/50 transition-all"
                  style={{ width: `${((offlineSources.length + noKeySources.length) / sources.length) * 100}%` }}
                />
              )}
            </div>
            {healthData?.lastFullCheck && (
              <p className="text-[10px] text-gray-500 mt-2">
                Last full check: {formatTime(healthData.lastFullCheck)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            <span className="ml-3 text-gray-400">Running health checks on all sources...</span>
          </div>
        )}

        {/* News Sources */}
        {newsSources.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Newspaper className="w-4 h-4" /> News Sources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {newsSources.map((source: SourceHealthResult) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Social Media Sources */}
        {socialSources.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Social Media Sources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {socialSources.map((source: SourceHealthResult) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Video Sources */}
        {videoSources.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Video className="w-4 h-4" /> Video Sources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {videoSources.map((source: SourceHealthResult) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* AI / LLM Sources */}
        {aiSources.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4" /> AI / LLM Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiSources.map((source: SourceHealthResult) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Source Details Table */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm text-gray-300">Source Details</CardTitle>
            <CardDescription className="text-xs text-gray-500">Complete overview of all data sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Source</th>
                    <th className="text-center py-2 px-3 text-gray-400 font-medium">Status</th>
                    <th className="text-center py-2 px-3 text-gray-400 font-medium">Response</th>
                    <th className="text-center py-2 px-3 text-gray-400 font-medium">Uptime</th>
                    <th className="text-center py-2 px-3 text-gray-400 font-medium">API Key</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {sources.map((source: SourceHealthResult) => (
                    <tr key={source.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <span className={getStatusColor(source.status)}>
                            {sourceIcons[source.id] || <Activity className="w-4 h-4" />}
                          </span>
                          <span className="text-white font-medium">{source.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">{getStatusBadge(source.status)}</td>
                      <td className={`py-2 px-3 text-center font-mono ${getResponseTimeColor(source.responseTimeMs)}`}>
                        {source.responseTimeMs}ms
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={source.uptime >= 80 ? 'text-emerald-400' : source.uptime >= 50 ? 'text-amber-400' : 'text-red-400'}>
                          {source.uptime}%
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {source.hasApiKey ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                        )}
                      </td>
                      <td className="py-2 px-3 text-gray-400 max-w-xs truncate">{source.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
