/**
 * Live Indices Page
 * 
 * Displays 5 key collective emotion indicators:
 * - Global Mood Index (GMI)
 * - Collective Fear Index (CFI)
 * - Hope Resilience Index (HRI)
 * - Stability Index
 * - Confidence Score
 */

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Heart, Shield, Zap } from 'lucide-react';

interface IndexData {
  timestamp: string;
  gmi: number;
  cfi: number;
  hri: number;
  stability: number;
  confidence: number;
}

interface HistoricalData {
  time: string;
  gmi: number;
  cfi: number;
  hri: number;
  stability: number;
}

export default function Indices() {
  const { t } = useI18n();
  const [currentIndices, setCurrentIndices] = useState<IndexData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching indices data
    const now = new Date();
    const mockCurrent: IndexData = {
      timestamp: now.toISOString(),
      gmi: 68,
      cfi: 32,
      hri: 72,
      stability: 65,
      confidence: 87,
    };

    // Generate historical data
    const mockHistorical: HistoricalData[] = [];
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000);
      mockHistorical.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        gmi: 65 + Math.random() * 10,
        cfi: 30 + Math.random() * 10,
        hri: 70 + Math.random() * 10,
        stability: 62 + Math.random() * 10,
      });
    }

    setCurrentIndices(mockCurrent);
    setHistoricalData(mockHistorical);
    setLoading(false);
  }, []);

  const getIndexColor = (value: number, inverse = false) => {
    if (inverse) {
      if (value <= 30) return 'text-green-500';
      if (value <= 50) return 'text-yellow-500';
      return 'text-red-500';
    } else {
      if (value >= 70) return 'text-green-500';
      if (value >= 50) return 'text-yellow-500';
      return 'text-red-500';
    }
  };

  const getIndexBgColor = (value: number, inverse = false) => {
    if (inverse) {
      if (value <= 30) return 'bg-green-500/10 border-green-500/20';
      if (value <= 50) return 'bg-yellow-500/10 border-yellow-500/20';
      return 'bg-red-500/10 border-red-500/20';
    } else {
      if (value >= 70) return 'bg-green-500/10 border-green-500/20';
      if (value >= 50) return 'bg-yellow-500/10 border-yellow-500/20';
      return 'bg-red-500/10 border-red-500/20';
    }
  };

  const getTrend = (current: number, previous: number) => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t.indices.gmiShort} • {t.indices.cfiShort} • {t.indices.hriShort}</h1>
          <p className="text-slate-400">Live collective emotion indicators updated in real-time</p>
        </div>

        {currentIndices && (
          <>
            {/* Current Indices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {/* GMI */}
              <Card className={`bg-slate-800 border-slate-700 ${getIndexBgColor(currentIndices.gmi)}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    {t.indices.gmiShort}
                  </CardTitle>
                  <CardDescription className="text-xs">{t.indices.gmiDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {currentIndices.gmi.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrend(currentIndices.gmi, 65) === 'up' && (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">+3.2%</span>
                      </>
                    )}
                    {getTrend(currentIndices.gmi, 65) === 'down' && (
                      <>
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-500">-2.1%</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* CFI */}
              <Card className={`bg-slate-800 border-slate-700 ${getIndexBgColor(currentIndices.cfi, true)}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {t.indices.cfiShort}
                  </CardTitle>
                  <CardDescription className="text-xs">{t.indices.cfiDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {currentIndices.cfi.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrend(currentIndices.cfi, 35) === 'down' && (
                      <>
                        <TrendingDown className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">-1.5%</span>
                      </>
                    )}
                    {getTrend(currentIndices.cfi, 35) === 'up' && (
                      <>
                        <TrendingUp className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-500">+2.3%</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* HRI */}
              <Card className={`bg-slate-800 border-slate-700 ${getIndexBgColor(currentIndices.hri)}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {t.indices.hriShort}
                  </CardTitle>
                  <CardDescription className="text-xs">{t.indices.hriDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {currentIndices.hri.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrend(currentIndices.hri, 70) === 'up' && (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">+1.8%</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stability */}
              <Card className={`bg-slate-800 border-slate-700 ${getIndexBgColor(currentIndices.stability)}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Stability
                  </CardTitle>
                  <CardDescription className="text-xs">System stability index</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {currentIndices.stability.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrend(currentIndices.stability, 63) === 'up' && (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-500">+0.9%</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Confidence */}
              <Card className={`bg-slate-800 border-slate-700 ${getIndexBgColor(currentIndices.confidence)}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Confidence</CardTitle>
                  <CardDescription className="text-xs">Analysis confidence score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {currentIndices.confidence.toFixed(1)}%
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full"
                      style={{ width: `${currentIndices.confidence}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 24-Hour Trend Chart */}
            <Card className="bg-slate-800 border-slate-700 mb-8">
              <CardHeader>
                <CardTitle>24-Hour Trend</CardTitle>
                <CardDescription>Historical indices movement over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="colorGMI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCFI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorHRI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="gmi"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorGMI)"
                      name="GMI"
                    />
                    <Area
                      type="monotone"
                      dataKey="cfi"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#colorCFI)"
                      name="CFI"
                    />
                    <Area
                      type="monotone"
                      dataKey="hri"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorHRI)"
                      name="HRI"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Index Descriptions */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Index Definitions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-1">{t.indices.gmi}</h4>
                    <p className="text-sm text-slate-300">{t.indices.gmiDesc}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400 mb-1">{t.indices.cfi}</h4>
                    <p className="text-sm text-slate-300">{t.indices.cfiDesc}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-1">{t.indices.hri}</h4>
                    <p className="text-sm text-slate-300">{t.indices.hriDesc}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
                    <p className="text-sm text-green-200">
                      <strong>Positive:</strong> GMI at {currentIndices.gmi.toFixed(1)} indicates strong collective optimism
                    </p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded p-3">
                    <p className="text-sm text-blue-200">
                      <strong>Resilience:</strong> HRI at {currentIndices.hri.toFixed(1)} shows high societal resilience
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3">
                    <p className="text-sm text-yellow-200">
                      <strong>Monitor:</strong> CFI at {currentIndices.cfi.toFixed(1)} - manageable fear levels
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
