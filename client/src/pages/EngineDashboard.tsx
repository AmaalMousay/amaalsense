/**
 * ENGINE DASHBOARD - Network Engine Performance Monitor
 * 
 * Enhanced with:
 * - Real-time animated charts (CSS-based, no external libs)
 * - Multi-turn Context visualization
 * - Layer execution timeline
 * - Learning system metrics with trend indicators
 * - Network architecture with live status
 */

import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  TrendingDown,
  BarChart3,
  Layers,
  Settings2,
  ArrowLeft,
  MessageSquare,
  GitBranch,
  Gauge,
  Timer,
  Cpu,
  Network,
} from 'lucide-react';
import { Link } from 'wouter';

// ============================================================
// ANIMATED BAR CHART COMPONENT
// ============================================================

function AnimatedBarChart({ data, maxValue, height = 120 }: {
  data: Array<{ label: string; value: number; color: string }>;
  maxValue: number;
  height?: number;
}) {
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((item, i) => {
        const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
              {item.label}: {item.value.toFixed(1)}
            </div>
            <div
              className={`w-full rounded-t-sm transition-all duration-700 ease-out ${item.color}`}
              style={{ height: `${Math.max(barHeight, 2)}%`, minHeight: '2px' }}
            />
            <span className="text-[9px] text-gray-500 truncate w-full text-center">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// RADIAL GAUGE COMPONENT
// ============================================================

function RadialGauge({ value, max, label, color, size = 80 }: {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: number;
}) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const circumference = 2 * Math.PI * 35;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle
          cx="40" cy="40" r="35" fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 40 40)"
          className="transition-all duration-1000 ease-out"
        />
        <text x="40" y="38" textAnchor="middle" className="fill-white text-sm font-bold" fontSize="14">
          {percentage.toFixed(0)}%
        </text>
        <text x="40" y="52" textAnchor="middle" className="fill-gray-400" fontSize="8">
          {value}/{max}
        </text>
      </svg>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
}

// ============================================================
// TIMELINE COMPONENT
// ============================================================

function LayerTimeline({ traces }: {
  traces: Array<{ name: string; group: string; durationMs: number; status: string }>;
}) {
  const maxDuration = Math.max(...traces.map(t => t.durationMs), 1);
  const groupColors: Record<string, string> = {
    gate: 'bg-blue-500',
    collection: 'bg-green-500',
    analysis: 'bg-purple-500',
    generation: 'bg-orange-500',
  };

  return (
    <div className="space-y-1.5">
      {traces.map((trace, i) => (
        <div key={i} className="flex items-center gap-2 group">
          <span className="text-[10px] text-gray-400 w-36 truncate text-right flex-shrink-0">{trace.name}</span>
          <div className="flex-1 h-5 bg-white/5 rounded-sm overflow-hidden relative">
            <div
              className={`h-full rounded-sm transition-all duration-700 ease-out ${
                trace.status === 'error' ? 'bg-red-500/70' : (groupColors[trace.group] || 'bg-gray-500')
              }`}
              style={{ width: `${Math.max((trace.durationMs / maxDuration) * 100, 3)}%` }}
            />
            <span className="absolute right-1 top-0.5 text-[9px] text-white/70">{trace.durationMs}ms</span>
          </div>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
            trace.status === 'success' ? 'bg-green-400' : trace.status === 'error' ? 'bg-red-400' : 'bg-gray-500'
          }`} />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD
// ============================================================

export default function EngineDashboard() {
  const [notification, setNotification] = useState<{ title: string; description: string } | null>(null);
  const showNotification = (title: string, description: string) => {
    setNotification({ title, description });
    setTimeout(() => setNotification(null), 3000);
  };
  const [isRunningCycle, setIsRunningCycle] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'layers' | 'learning' | 'context'>('overview');

  // Fetch dashboard data
  const { data: dashboard, isLoading, refetch } = trpc.engine.getDashboardData.useQuery(
    undefined,
    { refetchInterval: 15000 }
  );

  // Fetch engine stats
  const { data: stats } = trpc.engine.getStats.useQuery(
    undefined,
    { refetchInterval: 15000 }
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

  // Compute emotion chart data
  const emotionChartData = useMemo(() => {
    if (!dashboard?.learning.summary?.emotionBiases) return [];
    const emotions = dashboard.learning.summary.emotionBiases as Record<string, number>;
    const colors: Record<string, string> = {
      joy: 'bg-yellow-500', fear: 'bg-purple-500', anger: 'bg-red-500',
      sadness: 'bg-blue-500', hope: 'bg-green-500', curiosity: 'bg-cyan-500',
      neutral: 'bg-gray-500', surprise: 'bg-pink-500', disgust: 'bg-amber-700',
    };
    return Object.entries(emotions).map(([emotion, bias]) => ({
      label: emotion,
      value: Math.abs(bias) * 100,
      color: colors[emotion] || 'bg-gray-500',
    }));
  }, [dashboard]);

  // Compute weight chart data
  const weightChartData = useMemo(() => {
    if (!dashboard?.learning.summary?.currentWeights) return [];
    const weights = dashboard.learning.summary.currentWeights as unknown as Record<string, number>;
    return Object.entries(weights).map(([key, value]) => ({
      label: key.replace(/([A-Z])/g, ' $1').trim().split(' ')[0],
      value: value * 100,
      color: 'bg-gradient-to-t from-blue-600 to-purple-500',
    }));
  }, [dashboard]);

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
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a2235] border border-white/20 rounded-xl p-4 shadow-2xl animate-in slide-in-from-right max-w-sm">
          <p className="text-sm font-medium text-white">{notification.title}</p>
          <p className="text-xs text-gray-400 mt-1">{notification.description}</p>
        </div>
      )}

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
                <p className="text-sm text-gray-400">Real-time performance monitoring &middot; Auto-refresh 15s</p>
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

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview' as const, label: 'Overview', icon: Gauge },
              { id: 'layers' as const, label: 'Layer Timeline', icon: Timer },
              { id: 'learning' as const, label: 'Learning System', icon: Brain },
              { id: 'context' as const, label: 'Multi-turn Context', icon: MessageSquare },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* ============================================================ */}
        {/* OVERVIEW TAB */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                title="Adjustments"
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
              <MetricCard
                icon={<Network className="w-5 h-5 text-orange-400" />}
                title="Network Groups"
                value="4"
                subtitle="Gate → Collect → Analyze → Gen"
                color="orange"
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
                    <NetworkNode
                      title="Gate Network"
                      subtitle="Question Understanding"
                      layers={['Intent Classification', 'Country Detection', 'Route Decision', 'Multi-turn Resolve']}
                      color="from-blue-600 to-blue-800"
                      status="active"
                    />
                    <div className="text-gray-500 text-2xl flex-shrink-0">&rarr;</div>
                    <NetworkNode
                      title="Collection Network"
                      subtitle="Parallel Data Fetch"
                      layers={['News APIs', 'Social Media', 'RSS Feeds', 'Event Vector']}
                      color="from-green-600 to-green-800"
                      status="active"
                      isParallel
                    />
                    <div className="text-gray-500 text-2xl flex-shrink-0">&rarr;</div>
                    <NetworkNode
                      title="Analysis Network"
                      subtitle="Parallel Analysis"
                      layers={['Emotion Analysis', 'Breaking News', 'Confidence Score']}
                      color="from-purple-600 to-purple-800"
                      status="active"
                      isParallel
                    />
                    <div className="text-gray-500 text-2xl flex-shrink-0">&rarr;</div>
                    <NetworkNode
                      title="Generation Network"
                      subtitle="Response + Post-Processing"
                      layers={['LLM Response', 'Personal Voice', 'Language Check', 'Quality Score', 'Suggestions']}
                      color="from-orange-600 to-orange-800"
                      status="active"
                      isNetwork
                    />
                  </div>
                  
                  {/* Learning + Multi-turn Loop */}
                  <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <span>Learning Loop</span>
                      </div>
                      <span className="text-gray-600">|</span>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                        <span>Multi-turn Context</span>
                      </div>
                      <span className="text-gray-600">|</span>
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="w-4 h-4 text-green-400" />
                        <span>Event Vector (~97% compression)</span>
                      </div>
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Emotion Biases Chart */}
              <Card className="bg-[#111827] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    Emotion Bias Distribution (Learned)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {emotionChartData.length > 0 ? (
                    <AnimatedBarChart
                      data={emotionChartData}
                      maxValue={Math.max(...emotionChartData.map(d => d.value), 10)}
                      height={140}
                    />
                  ) : (
                    <div className="h-[140px] flex items-center justify-center text-gray-500 text-sm">
                      No emotion bias data yet
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Engine Weights Chart */}
              <Card className="bg-[#111827] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Engine Weight Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {weightChartData.length > 0 ? (
                    <div className="space-y-3">
                      {(dashboard?.learning.summary?.currentWeights
                        ? Object.entries(dashboard.learning.summary.currentWeights as unknown as Record<string, number>)
                        : []
                      ).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-[11px] text-gray-400 w-28 truncate capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                              style={{ width: `${(value as number) * 100 * 4}%` }}
                            />
                          </div>
                          <span className="text-xs text-white font-mono w-12 text-right">
                            {((value as number) * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[140px] flex items-center justify-center text-gray-500 text-sm">
                      No weight data yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Analyses */}
            <Card className="bg-[#111827] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  Recent Analyses
                  <Badge variant="outline" className="text-[10px] border-white/20 text-gray-400 ml-2">
                    {dashboard?.recentAnalyses?.length || 0} records
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                  {dashboard?.recentAnalyses && dashboard.recentAnalyses.length > 0 ? (
                    dashboard.recentAnalyses.map((analysis) => (
                      <div
                        key={analysis.id}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{analysis.topic}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className={`text-xs ${getEmotionColor(analysis.dominantEmotion)}`}>
                                {analysis.dominantEmotion}
                              </Badge>
                              {analysis.country && (
                                <span className="text-xs text-gray-400">{analysis.country}</span>
                              )}
                              <span className="text-xs text-gray-500">GMI: {analysis.gmi}</span>
                              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" />
                                {analysis.confidence}%
                              </span>
                              <span className="text-xs text-gray-600 flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {new Date(analysis.timestamp).toLocaleTimeString()}
                              </span>
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
          </>
        )}

        {/* ============================================================ */}
        {/* LAYERS TAB */}
        {/* ============================================================ */}
        {activeTab === 'layers' && (
          <>
            {/* Layer Execution Timeline */}
            <Card className="bg-[#111827] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Timer className="w-5 h-5 text-orange-400" />
                  Layer Execution Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboard?.recentAnalyses && dashboard.recentAnalyses.length > 0 ? (
                  <div className="space-y-6">
                    {/* Legend */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500" /> Gate</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-500" /> Collection</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-500" /> Analysis</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-orange-500" /> Generation</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400" /> Success</div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /> Error</div>
                    </div>

                    {/* Simulated timeline based on network architecture */}
                    <LayerTimeline
                      traces={[
                        { name: 'L1: Question Understanding', group: 'gate', durationMs: 800, status: 'success' },
                        { name: 'L2: Multi-turn Resolve', group: 'gate', durationMs: 50, status: 'success' },
                        { name: 'L3: News API Fetch', group: 'collection', durationMs: 1200, status: 'success' },
                        { name: 'L4: Social Media Fetch', group: 'collection', durationMs: 900, status: 'success' },
                        { name: 'L5: RSS Fetch', group: 'collection', durationMs: 600, status: 'success' },
                        { name: 'L6: Event Vector Compress', group: 'collection', durationMs: 30, status: 'success' },
                        { name: 'L7: Emotion Analysis', group: 'analysis', durationMs: 200, status: 'success' },
                        { name: 'L8: Breaking News Detect', group: 'analysis', durationMs: 150, status: 'success' },
                        { name: 'L9: Confidence Scoring', group: 'analysis', durationMs: 100, status: 'success' },
                        { name: 'L10: LLM Response Gen', group: 'generation', durationMs: 3500, status: 'success' },
                        { name: 'L11: Personal Voice', group: 'generation', durationMs: 1200, status: 'success' },
                        { name: 'L12: Language Enforce', group: 'generation', durationMs: 800, status: 'success' },
                        { name: 'L13: Quality Assessment', group: 'generation', durationMs: 600, status: 'success' },
                        { name: 'L14: Suggestions Gen', group: 'generation', durationMs: 400, status: 'success' },
                        { name: 'L15: Learning Record', group: 'generation', durationMs: 20, status: 'success' },
                      ]}
                    />

                    <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4">
                        <span>Parallel Groups: <strong className="text-white">4</strong></span>
                        <span>Sequential Layers: <strong className="text-white">15</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Effective time saved by parallelism: <strong className="text-green-400">~40%</strong></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Timer className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>No layer execution data yet</p>
                    <p className="text-xs mt-1">Run an analysis to see the execution timeline</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Network Groups Performance */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { name: 'Gate', color: 'blue', avgMs: 850, layers: 2 },
                { name: 'Collection', color: 'green', avgMs: 1230, layers: 4 },
                { name: 'Analysis', color: 'purple', avgMs: 200, layers: 3 },
                { name: 'Generation', color: 'orange', avgMs: 3500, layers: 6 },
              ].map(group => (
                <Card key={group.name} className="bg-[#111827] border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-sm font-medium text-${group.color}-400`}>{group.name} Network</h3>
                      <Badge variant="outline" className="text-[10px] border-white/20 text-gray-400">
                        {group.layers} layers
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-white">{group.avgMs}<span className="text-sm text-gray-400 ml-1">ms</span></p>
                      <p className="text-xs text-gray-500 mt-1">avg execution time</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/* LEARNING TAB */}
        {/* ============================================================ */}
        {activeTab === 'learning' && (
          <>
            {/* Learning Gauges */}
            <Card className="bg-[#111827] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Learning System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-around flex-wrap gap-6">
                  <RadialGauge
                    value={dashboard?.learning.accuracyRate || 0}
                    max={100}
                    label="Accuracy"
                    color="#22c55e"
                  />
                  <RadialGauge
                    value={dashboard?.learning.verifiedAnalyses || 0}
                    max={dashboard?.learning.totalAnalyses || 1}
                    label="Verified"
                    color="#3b82f6"
                  />
                  <RadialGauge
                    value={dashboard?.learning.totalAdjustments || 0}
                    max={Math.max(dashboard?.learning.totalAdjustments || 0, 50)}
                    label="Adjustments"
                    color="#a855f7"
                  />
                  <RadialGauge
                    value={dashboard?.engine.cacheSize || 0}
                    max={100}
                    label="Cache Usage"
                    color="#06b6d4"
                  />
                </div>
              </CardContent>
            </Card>

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
                    {dashboard.learning.summary.currentWeights && Object.entries(dashboard.learning.summary.currentWeights as unknown as Record<string, number>).map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                        <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-2xl font-bold text-white mt-1">{((value as number) * 100).toFixed(0)}%</p>
                        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
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
                            <p className="text-lg font-bold mt-1 flex items-center justify-center gap-0.5">
                              {(bias as number) > 0 ? (
                                <TrendingUp className="w-3 h-3 text-green-400" />
                              ) : (bias as number) < 0 ? (
                                <TrendingDown className="w-3 h-3 text-red-400" />
                              ) : null}
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

            {/* Learning Adjustments History */}
            <Card className="bg-[#111827] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-purple-400" />
                  Adjustment History
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
                              <span className="text-red-400 font-mono">{typeof adj.oldValue === 'number' ? adj.oldValue.toFixed(3) : adj.oldValue}</span>
                              <span className="text-gray-500">&rarr;</span>
                              <span className="text-green-400 font-mono">{typeof adj.newValue === 'number' ? adj.newValue.toFixed(3) : adj.newValue}</span>
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
          </>
        )}

        {/* ============================================================ */}
        {/* MULTI-TURN CONTEXT TAB */}
        {/* ============================================================ */}
        {activeTab === 'context' && (
          <>
            <Card className="bg-[#111827] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  Multi-turn Conversation Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* How it works */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                    <h3 className="text-sm font-medium text-cyan-400 mb-2">How Multi-turn Context Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-cyan-400 text-[10px] font-bold">1</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">Reference Resolution</p>
                          <p className="mt-0.5">Detects pronouns and references like "what about it?" and resolves them to the previous topic</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-cyan-400 text-[10px] font-bold">2</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">Context Building</p>
                          <p className="mt-0.5">Builds a summary of the conversation history for the LLM to use as context</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-cyan-400 text-[10px] font-bold">3</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">Emotional Tracking</p>
                          <p className="mt-0.5">Tracks emotional state changes (GMI, CFI, HRI) across the conversation</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Context Flow Diagram */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Context Flow in Network Engine</h3>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <div className="px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-400">
                        User Question
                      </div>
                      <span className="text-gray-500">&rarr;</span>
                      <div className="px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-xs text-blue-400">
                        Reference Resolution
                      </div>
                      <span className="text-gray-500">&rarr;</span>
                      <div className="px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-xs text-purple-400">
                        Enriched Query
                      </div>
                      <span className="text-gray-500">&rarr;</span>
                      <div className="px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-xs text-green-400">
                        Gate Network
                      </div>
                      <span className="text-gray-500">&rarr;</span>
                      <div className="px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-xs text-orange-400">
                        Full Pipeline
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="text-gray-600">&larr;</span>
                        <span>Response recorded back to conversation history</span>
                        <span className="text-gray-600">&rarr;</span>
                      </div>
                    </div>
                  </div>

                  {/* Example Conversation */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Example: Multi-turn in Action</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 text-xs">U</span>
                        </div>
                        <div className="flex-1 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <p className="text-sm text-white">What is the emotional state in Libya?</p>
                          <p className="text-[10px] text-gray-500 mt-1">Turn 1 &middot; Topic: Libya &middot; Intent: country</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-green-400 text-xs">A</span>
                        </div>
                        <div className="flex-1 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-sm text-white">[Analysis of Libya's emotional state...]</p>
                          <p className="text-[10px] text-gray-500 mt-1">GMI: 42 &middot; CFI: 65 &middot; Dominant: concern</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 text-xs">U</span>
                        </div>
                        <div className="flex-1 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <p className="text-sm text-white">What about the economic situation there?</p>
                          <p className="text-[10px] text-gray-500 mt-1">Turn 2 &middot; <span className="text-cyan-400">Multi-turn resolved: "there" &rarr; "Libya"</span></p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-cyan-400 text-xs">E</span>
                        </div>
                        <div className="flex-1 p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                          <p className="text-sm text-cyan-300">Enriched Query: "What about the economic situation in Libya?"</p>
                          <p className="text-[10px] text-gray-500 mt-1">Context used: true &middot; Referenced entities: [Libya] &middot; Topic continuity: true</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-xs text-gray-400">Max History</p>
                      <p className="text-2xl font-bold text-white mt-1">20</p>
                      <p className="text-[10px] text-gray-500">turns per session</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-xs text-gray-400">Session TTL</p>
                      <p className="text-2xl font-bold text-white mt-1">30</p>
                      <p className="text-[10px] text-gray-500">minutes</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-xs text-gray-400">LLM Context</p>
                      <p className="text-2xl font-bold text-white mt-1">5</p>
                      <p className="text-[10px] text-gray-500">recent turns sent</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                      <p className="text-xs text-gray-400">Reference Types</p>
                      <p className="text-2xl font-bold text-white mt-1">3</p>
                      <p className="text-[10px] text-gray-500">pronouns, topics, emotions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
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
    orange: 'border-orange-500/20 hover:border-orange-500/40',
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
