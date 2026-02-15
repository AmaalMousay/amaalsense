/**
 * System Health Page - Real-time system monitoring
 */

import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, AlertTriangle, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SystemHealth() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  // Fetch health data
  const { data: health, refetch: refetchHealth } = trpc.dashboard.getHealth.useQuery(undefined, {
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const { data: summary } = trpc.dashboard.getHealthSummary.useQuery(undefined, {
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const { data: metrics } = trpc.dashboard.getMetrics.useQuery(undefined, {
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const { data: alerts } = trpc.dashboard.getAlerts.useQuery(undefined, {
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const { data: cacheStats } = trpc.dashboard.getCacheStats.useQuery(undefined, {
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const { data: feedbackStats } = trpc.dashboard.getFeedbackStats.useQuery(undefined, {
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      healthy: 'default',
      warning: 'secondary',
      critical: 'destructive',
      offline: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">System Health Monitor</h1>
            <p className="text-muted-foreground">Real-time system health and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
            </Button>
            <Button variant="outline" onClick={() => refetchHealth()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getStatusIcon(health?.overallStatus || 'unknown')}
                <span className="text-2xl font-bold capitalize">{health?.overallStatus}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Uptime: {summary?.uptime}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{health?.performance.avgResponseTime}ms</p>
              <p className="text-xs text-muted-foreground mt-2">Average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{health?.performance.errorRate}%</p>
              <p className="text-xs text-muted-foreground mt-2">
                {summary?.totalErrors} / {summary?.totalRequests}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Requests/sec</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{health?.performance.requestsPerSecond}</p>
              <p className="text-xs text-muted-foreground mt-2">Current</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.map((metric) => (
                  <div key={metric.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{metric.name}</span>
                      {getStatusIcon(metric.status)}
                    </div>
                    <span className="text-sm font-bold">
                      {metric.value} {metric.unit}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">CPU</span>
                    <span className="text-sm font-bold">{health?.system.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${health?.system.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Memory</span>
                    <span className="text-sm font-bold">{health?.system.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${health?.system.memoryUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Disk</span>
                    <span className="text-sm font-bold">{health?.system.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${health?.system.diskUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cache & Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Cache Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Analysis</span>
                  <span className="font-bold">{cacheStats?.analysis.hitRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Prediction</span>
                  <span className="font-bold">{cacheStats?.prediction.hitRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>User</span>
                  <span className="font-bold">{cacheStats?.user.hitRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>General</span>
                  <span className="font-bold">{cacheStats?.general.hitRate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Feedback</span>
                  <span className="font-bold">{feedbackStats?.totalFeedback}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accuracy</span>
                  <span className="font-bold text-green-600">
                    {feedbackStats?.accuracyRate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Rating</span>
                  <span className="font-bold">{feedbackStats?.averageRating.toFixed(2)}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Correct</span>
                  <span className="font-bold text-green-600">{feedbackStats?.correctCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        {alerts && alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {alerts.map((alert, idx) => (
                  <div key={idx} className="flex gap-2 p-2 bg-muted rounded">
                    {alert.level === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    {alert.level === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    {alert.level === 'info' && <Activity className="w-4 h-4 text-blue-500" />}
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
