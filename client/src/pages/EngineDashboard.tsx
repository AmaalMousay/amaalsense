/**
 * ENGINE DASHBOARD - Network Engine Performance Monitor
 * 
 * Real-time visualization of:
 * - Network layer execution traces
 * - Learning system metrics
 * - Recent analyses with feedback
 * - Adjustment history
 */

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Simple notification state instead of toast
import {
  Activity,
  Brain,
  Database,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  BarChart3,
  Layers,
  Settings2,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'wouter';

export default function EngineDashboard() {
  const [notification, setNotification] = useState<{ title: string; description: string } | null>(null);
  const showNotification = (title: string, description: string) => {
    setNotification({ title, description });
    setTimeout(() => setNotification(null), 3000);
  };
  const [isRunningCycle, setIsRunningCycle] = useState(false);

  // Fetch dashboard data
  const { data: dashboard, isLoading, refetch } = trpc.engine.getDashboardData.useQuery(
    undefined,
    { refetchInterval: 30000 } // Auto-refresh every 30s
  );

  // Fetch engine stats
  const { data: stats } = trpc.engine.getStats.useQuery(
    undefined,
    { refetchInterval: 30000 }
  );

  // Learning cycle mutation
  const runLearningCycle = trpc.engine.runLearningCycle.useMutation({
    onSuccess: (result) => {
      showNotification('Learning Cycle Complete', `Reviewed ${result.analysesReviewed} analyses, made ${result.adjustmentsMade} adjustments`);
      refetch();
      setIsRunningCycle(false);
    },
    onError: () => {
      showNotification('Error', 'Failed to run learning cycle');
      setIsRunningCycle(false);
    },
  });

  // Feedback mutation
  const submitFeedback = trpc.engine.submitFeedback.useMutation({
    onSuccess: () => {
      showNotification('Feedback Submitted', 'Thank you for helping the engine learn!');
      refetch();
    },
  });

  // Clear caches mutation
  const clearCaches = trpc.engine.clearCaches.useMutation({
    onSuccess: () => {
      showNotification('Caches Cleared', 'All engine caches have been cleared');
      refetch();
    },
  });

  const handleRunLearningCycle = () => {
    setIsRunningCycle(true);
    runLearningCycle.mutate();
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      fear: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      anger: 'bg-red-500/20 text-red-400 border-red-500/30',
      sadness: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      hope: 'bg-green-500/20 text-green-400 border-green-500/30',
      curiosity: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[emotion] || colors.neutral;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/10 rounded w-1/3" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0d1220]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Network Engine Dashboard</h1>
                <p className="text-sm text-gray-400">Real-time performance monitoring</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearCaches.mutate()}
              className="border-white/20 text-gray-300 hover:text-white"
            >
              <Database className="w-4 h-4 mr-2" />
              Clear Caches
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-white/20 text-gray-300 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleRunLearningCycle}
              disabled={isRunningCycle}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              {isRunningCycle ? 'Running...' : 'Run Learning Cycle'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Activity className="w-5 h-5 text-blue-400" />}
            title="Total Analyses"
            value={dashboard?.learning.totalAnalyses || 0}
            subtitle="Processed by engine"
            color="blue"
          />
          <MetricCard
            icon={<CheckCircle className="w-5 h-5 text-green-400" />}
            title="Accuracy Rate"
            value={`${dashboard?.learning.accuracyRate || 0}%`}
            subtitle={`${dashboard?.learning.verifiedAnalyses || 0} verified`}
            color="green"
          />
          <MetricCard
            icon={<Brain className="w-5 h-5 text-purple-400" />}
            title="Learning Adjustments"
            value={dashboard?.learning.totalAdjustments || 0}
            subtitle="Weight corrections"
            color="purple"
          />
          <MetricCard
            icon={<Database className="w-5 h-5 text-cyan-400" />}
            title="Cache Size"
            value={dashboard?.engine.cacheSize || 0}
            subtitle="Cached results"
            color="cyan"
          />
        </div>

        {/* Network Architecture Visualization */}
        <Card className="bg-[#111827] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Network Engine Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Network Flow Visualization */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
                {/* Gate Network */}
                <NetworkNode
                  title="Gate Network"
                  subtitle="Question Understanding"
                  layers={['Intent Classification', 'Country Detection', 'Route Decision']}
                  color="from-blue-600 to-blue-800"
                  status="active"
                />
                
                <div className="text-gray-500 text-2xl flex-shrink-0">&rarr;</div>
                
                {/* Collection Network */}
                <NetworkNode
                  title="Collection Network"
                  subtitle="Parallel Data Fetch"
                  layers={['News APIs', 'Social Media', 'RSS Feeds', 'Event Vector']}
                  color="from-green-600 to-green-800"
                  status="active"
                  isParallel
                />
                
                <div className="text-gray-500 text-2xl flex-shrink-0">&rarr;</div>
                
                {/* Analysis Network */}
                <NetworkNode
                  title="Analysis Network"
                  subtitle="Parallel Analysis"
                  layers={['Emotion Analysis', 'Breaking News', 'Confidence Score']}
                  color="from-purple-600 to-purple-800"
                  status="active"
                  isParallel
                />
                
                <div className="text-gray-500 text-2xl flex-shrink-0">&rarr;</div>
                
                {/* Generation Network */}
                <NetworkNode
                  title="Generation Network"
                  subtitle="Response + Post-Processing"
                  layers={['LLM Response', 'Personal Voice', 'Language Check', 'Quality Score', 'Suggestions']}
                  color="from-orange-600 to-orange-800"
                  status="active"
                  isNetwork
                />
              </div>
              
              {/* Learning Loop Arrow */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Learning Loop: Records every analysis, adjusts weights over time</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Analyses */}
          <Card className="bg-[#111827] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Recent Analyses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {dashboard?.recentAnalyses && dashboard.recentAnalyses.length > 0 ? (
                  dashboard.recentAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{analysis.topic}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`text-xs ${getEmotionColor(analysis.dominantEmotion)}`}>
                              {analysis.dominantEmotion}
                            </Badge>
                            <span className="text-xs text-gray-400">{analysis.country}</span>
                            <span className="text-xs text-gray-500">GMI: {analysis.gmi}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {analysis.verified === null ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                onClick={() => submitFeedback.mutate({ analysisId: analysis.id, rating: 5 })}
                                title="Correct"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                onClick={() => submitFeedback.mutate({ analysisId: analysis.id, rating: 1 })}
                                title="Incorrect"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Badge variant="outline" className={analysis.verified ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'}>
                              {analysis.verified ? 'Correct' : 'Incorrect'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Confidence: {analysis.confidence}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(analysis.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No analyses recorded yet</p>
                    <p className="text-xs mt-1">Run a search in Smart Analysis to see data here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Learning Adjustments */}
          <Card className="bg-[#111827] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-purple-400" />
                Learning Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {dashboard?.adjustments && dashboard.adjustments.length > 0 ? (
                  dashboard.adjustments.map((adj) => (
                    <div
                      key={adj.id}
                      className="p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{adj.engine}</p>
                          <p className="text-xs text-gray-400">{adj.parameter}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-red-400">{typeof adj.oldValue === 'number' ? adj.oldValue.toFixed(3) : adj.oldValue}</span>
                            <span className="text-gray-500">&rarr;</span>
                            <span className="text-green-400">{typeof adj.newValue === 'number' ? adj.newValue.toFixed(3) : adj.newValue}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{adj.reason}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No adjustments yet</p>
                    <p className="text-xs mt-1">Run a learning cycle to see adjustments</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engine Weights */}
        {dashboard?.learning.summary && (
          <Card className="bg-[#111827] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Current Engine Weights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {dashboard.learning.summary.currentWeights && Object.entries(dashboard.learning.summary.currentWeights).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-2xl font-bold text-white mt-1">{((value as number) * 100).toFixed(0)}%</p>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${(value as number) * 100 * 4}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Emotion Biases */}
              {dashboard.learning.summary.emotionBiases && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Emotion Biases (Learned)</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {Object.entries(dashboard.learning.summary.emotionBiases).map(([emotion, bias]) => (
                      <div key={emotion} className={`p-2 rounded-lg border text-center ${getEmotionColor(emotion)}`}>
                        <p className="text-xs capitalize">{emotion}</p>
                        <p className="text-lg font-bold mt-1">
                          {(bias as number) > 0 ? '+' : ''}{((bias as number) * 100).toFixed(1)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function MetricCard({ icon, title, value, subtitle, color }: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}) {
  const borderColors: Record<string, string> = {
    blue: 'border-blue-500/20 hover:border-blue-500/40',
    green: 'border-green-500/20 hover:border-green-500/40',
    purple: 'border-purple-500/20 hover:border-purple-500/40',
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40',
  };

  return (
    <Card className={`bg-[#111827] ${borderColors[color]} transition-colors`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5">{icon}</div>
          <div>
            <p className="text-xs text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NetworkNode({ title, subtitle, layers, color, status, isParallel, isNetwork }: {
  title: string;
  subtitle: string;
  layers: string[];
  color: string;
  status: 'active' | 'idle' | 'error';
  isParallel?: boolean;
  isNetwork?: boolean;
}) {
  return (
    <div className="flex-shrink-0 w-48">
      <div className={`rounded-xl bg-gradient-to-br ${color} p-3 border border-white/10`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
        </div>
        <p className="text-xs text-white/60 mb-2">{subtitle}</p>
        
        {isParallel && (
          <Badge variant="outline" className="text-[10px] mb-2 border-white/30 text-white/70">PARALLEL</Badge>
        )}
        {isNetwork && (
          <Badge variant="outline" className="text-[10px] mb-2 border-white/30 text-white/70">NETWORK</Badge>
        )}
        
        <div className="space-y-1">
          {layers.map((layer, i) => (
            <div key={i} className="text-[10px] text-white/50 bg-black/20 rounded px-2 py-0.5">
              {layer}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
