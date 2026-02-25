/**
 * DCFT Analysis Chart Component
 * عرض تحليل DCFT مع الرسوم البيانية التفاعلية
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface DCFTData {
  timestamp: Date;
  dcftScore: number;
  emotionIntensity: number;
  regionalImpact: number;
}

interface DCFTAnalysisChartProps {
  data?: DCFTData[];
  currentScore?: number;
  trend?: 'up' | 'down' | 'stable';
}

export function DCFTAnalysisChart({ 
  data = [],
  currentScore = 65,
  trend = 'up'
}: DCFTAnalysisChartProps) {
  // Generate mock data if not provided
  const chartData = data.length > 0 ? data : Array.from({ length: 7 }, (_, i) => ({
    timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
    dcftScore: 50 + Math.random() * 30,
    emotionIntensity: 40 + Math.random() * 40,
    regionalImpact: 45 + Math.random() * 35,
  }));

  const maxScore = Math.max(...chartData.map(d => d.dcftScore));
  const minScore = Math.min(...chartData.map(d => d.dcftScore));

  return (
    <Card className="border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          تحليل DCFT (Digital Collective Feeling Tracker)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Score Display */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <div>
            <p className="text-sm text-muted-foreground">النتيجة الحالية</p>
            <p className="text-4xl font-bold text-purple-400 mt-1">{currentScore}</p>
          </div>
          <div className="flex items-center gap-2">
            {trend === 'up' && (
              <>
                <TrendingUp className="h-6 w-6 text-green-500" />
                <span className="text-green-500 font-semibold">+{((currentScore - minScore) / minScore * 100).toFixed(1)}%</span>
              </>
            )}
            {trend === 'down' && (
              <>
                <TrendingUp className="h-6 w-6 text-red-500 rotate-180" />
                <span className="text-red-500 font-semibold">-{((maxScore - currentScore) / maxScore * 100).toFixed(1)}%</span>
              </>
            )}
            {trend === 'stable' && (
              <>
                <Activity className="h-6 w-6 text-gray-500" />
                <span className="text-gray-500 font-semibold">مستقر</span>
              </>
            )}
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">الاتجاه الزمني (آخر 7 أيام)</p>
          <div className="relative h-48 flex items-end gap-2">
            {chartData.map((item, index) => {
              const height = (item.dcftScore / 100) * 100;
              const isLast = index === chartData.length - 1;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="relative w-full group">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isLast 
                          ? 'bg-gradient-to-t from-purple-600 to-purple-400' 
                          : 'bg-gradient-to-t from-purple-600/60 to-purple-400/60'
                      } hover:opacity-80 cursor-pointer`}
                      style={{ height: `${height}%` }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        <p className="text-xs font-semibold">{item.dcftScore.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.timestamp.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.timestamp.toLocaleDateString('ar-SA', { weekday: 'short' })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-slate-800/50 text-center">
            <p className="text-xs text-muted-foreground">أعلى قيمة</p>
            <p className="text-lg font-bold text-green-400 mt-1">{maxScore.toFixed(1)}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 text-center">
            <p className="text-xs text-muted-foreground">أقل قيمة</p>
            <p className="text-lg font-bold text-red-400 mt-1">{minScore.toFixed(1)}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 text-center">
            <p className="text-xs text-muted-foreground">المتوسط</p>
            <p className="text-lg font-bold text-blue-400 mt-1">
              {(chartData.reduce((sum, d) => sum + d.dcftScore, 0) / chartData.length).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Formula Explanation */}
        <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <p className="text-xs font-semibold mb-2">معادلة DCFT:</p>
          <code className="text-xs text-purple-400 font-mono">
            D(t) = Σ [Eᵢ × Wᵢ × ΔTᵢ]
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            حيث: E = شدة العاطفة، W = الوزن، ΔT = التغير الزمني
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
