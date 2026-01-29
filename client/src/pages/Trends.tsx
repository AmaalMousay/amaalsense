import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, AlertTriangle, BarChart3, PieChart, Bell, CheckCircle } from "lucide-react";

export default function Trends() {
  const [days, setDays] = useState(30);
  
  const { data: dailyTrends, isLoading: trendsLoading } = trpc.analytics.getDailyTrends.useQuery({ days });
  const { data: emotionDist, isLoading: emotionLoading } = trpc.analytics.getEmotionDistribution.useQuery({ days: 7 });
  const { data: platformStats, isLoading: platformLoading } = trpc.analytics.getPlatformStats.useQuery({ days: 7 });
  const { data: overallStats, isLoading: statsLoading } = trpc.analytics.getOverallStats.useQuery();
  const { data: alerts, isLoading: alertsLoading, refetch: refetchAlerts } = trpc.analytics.getRecentAlerts.useQuery({ limit: 10, unacknowledgedOnly: false });
  
  const acknowledgeAlert = trpc.analytics.acknowledgeAlert.useMutation({
    onSuccess: () => refetchAlerts(),
  });

  const emotionColors: Record<string, string> = {
    joy: "bg-yellow-500",
    fear: "bg-purple-500",
    anger: "bg-red-500",
    sadness: "bg-blue-500",
    hope: "bg-green-500",
    curiosity: "bg-cyan-500",
    neutral: "bg-gray-500",
  };

  const emotionLabels: Record<string, string> = {
    joy: "الفرح",
    fear: "الخوف",
    anger: "الغضب",
    sadness: "الحزن",
    hope: "الأمل",
    curiosity: "الفضول",
    neutral: "محايد",
  };

  const platformLabels: Record<string, string> = {
    news: "الأخبار",
    reddit: "Reddit",
    youtube: "YouTube",
    mastodon: "Mastodon",
    bluesky: "Bluesky",
    telegram: "Telegram",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-violet-400" />
                Historical Trends
              </h1>
              <p className="text-slate-400 mt-1">Track emotional patterns and analyze historical data</p>
            </div>
            <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
              <SelectTrigger className="w-40 bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="60">Last 60 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Sessions</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : overallStats?.totalSessions || 0}
                  </p>
                </div>
                <Activity className="h-10 w-10 text-violet-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Sources Analyzed</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : overallStats?.totalSources || 0}
                  </p>
                </div>
                <BarChart3 className="h-10 w-10 text-cyan-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg GMI</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : overallStats?.avgGmi || 0}
                  </p>
                </div>
                {(overallStats?.avgGmi || 0) >= 0 ? (
                  <TrendingUp className="h-10 w-10 text-green-400 opacity-50" />
                ) : (
                  <TrendingDown className="h-10 w-10 text-red-400 opacity-50" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Alerts</p>
                  <p className="text-3xl font-bold text-white">
                    {statsLoading ? "..." : overallStats?.activeAlerts || 0}
                  </p>
                </div>
                <AlertTriangle className="h-10 w-10 text-amber-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Trends Chart */}
          <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-violet-400" />
                Daily Index Trends
              </CardTitle>
              <CardDescription>GMI, CFI, and HRI over time</CardDescription>
            </CardHeader>
            <CardContent>
              {trendsLoading ? (
                <div className="h-64 flex items-center justify-center text-slate-400">Loading trends...</div>
              ) : dailyTrends && dailyTrends.length > 0 ? (
                <div className="space-y-4">
                  {/* Simple bar visualization */}
                  <div className="space-y-3">
                    {dailyTrends.slice(-10).map((day, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{day.date}</span>
                          <span>{day.count} analyses</span>
                        </div>
                        <div className="flex gap-1 h-6">
                          <div
                            className="bg-green-500/70 rounded"
                            style={{ width: `${Math.max(5, (day.gmi + 100) / 2)}%` }}
                            title={`GMI: ${day.gmi}`}
                          />
                          <div
                            className="bg-purple-500/70 rounded"
                            style={{ width: `${Math.max(5, day.cfi)}%` }}
                            title={`CFI: ${day.cfi}`}
                          />
                          <div
                            className="bg-cyan-500/70 rounded"
                            style={{ width: `${Math.max(5, day.hri)}%` }}
                            title={`HRI: ${day.hri}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 justify-center text-xs">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500/70 rounded" /> GMI</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500/70 rounded" /> CFI</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cyan-500/70 rounded" /> HRI</span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                  <BarChart3 className="h-12 w-12 mb-3 opacity-50" />
                  <p>No trend data available yet</p>
                  <p className="text-sm">Run some analyses to see trends here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Emotion Distribution */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-violet-400" />
                Emotion Distribution
              </CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {emotionLoading ? (
                <div className="h-48 flex items-center justify-center text-slate-400">Loading...</div>
              ) : emotionDist && Object.keys(emotionDist).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(emotionDist)
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, count]) => {
                      const total = Object.values(emotionDist).reduce((a, b) => a + b, 0);
                      const percent = Math.round((count / total) * 100);
                      return (
                        <div key={emotion} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300">{emotionLabels[emotion] || emotion}</span>
                            <span className="text-slate-400">{percent}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${emotionColors[emotion] || "bg-gray-500"} rounded-full`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                  <PieChart className="h-10 w-10 mb-2 opacity-50" />
                  <p className="text-sm">No emotion data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform Stats & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Platform Statistics */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-violet-400" />
                Platform Statistics
              </CardTitle>
              <CardDescription>Sources analyzed by platform (last 7 days)</CardDescription>
            </CardHeader>
            <CardContent>
              {platformLoading ? (
                <div className="h-48 flex items-center justify-center text-slate-400">Loading...</div>
              ) : platformStats && Object.keys(platformStats).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(platformStats).map(([platform, stats]) => (
                    <div key={platform} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{platformLabels[platform] || platform}</p>
                        <p className="text-sm text-slate-400">{stats.count} sources</p>
                      </div>
                      <Badge variant={stats.avgSentiment >= 0 ? "default" : "destructive"}>
                        {stats.avgSentiment >= 0 ? "+" : ""}{stats.avgSentiment}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                  <BarChart3 className="h-10 w-10 mb-2 opacity-50" />
                  <p className="text-sm">No platform data yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-violet-400" />
                Recent Alerts
              </CardTitle>
              <CardDescription>Significant trend changes detected</CardDescription>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="h-48 flex items-center justify-center text-slate-400">Loading...</div>
              ) : alerts && alerts.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.acknowledged
                          ? "bg-slate-800/30 border-slate-700"
                          : "bg-amber-950/30 border-amber-800"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {alert.alertType === "spike" ? (
                            <TrendingUp className="h-4 w-4 text-green-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          )}
                          <span className="font-medium text-white text-sm">{alert.metric.toUpperCase()}</span>
                          <Badge
                            variant={
                              alert.severity === "high" ? "destructive" :
                              alert.severity === "medium" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2"
                            onClick={() => acknowledgeAlert.mutate({ alertId: alert.id })}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {alert.previousValue} → {alert.currentValue} ({alert.changePercent > 0 ? "+" : ""}{alert.changePercent}%)
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                  <Bell className="h-10 w-10 mb-2 opacity-50" />
                  <p className="text-sm">No alerts yet</p>
                  <p className="text-xs">Alerts appear when significant changes are detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
