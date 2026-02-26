/**
 * Live Dashboard Preview Component
 * معاينة لوحة المعلومات المباشرة
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardMetric {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  icon: React.ReactNode;
  color: string;
}

interface LiveDashboardPreviewProps {
  metrics?: DashboardMetric[];
}

export function LiveDashboardPreview({ metrics }: LiveDashboardPreviewProps) {
  const defaultMetrics: DashboardMetric[] = [
    {
      label: 'Global Mood Index',
      value: 65,
      unit: '%',
      trend: 'up',
      trendValue: 5,
      icon: <Activity className="h-5 w-5" />,
      color: 'text-green-400'
    },
    {
      label: 'Collective Feeling Index',
      value: 72,
      unit: '%',
      trend: 'up',
      trendValue: 3,
      icon: <Zap className="h-5 w-5" />,
      color: 'text-blue-400'
    },
    {
      label: 'Hope Resonance Index',
      value: 58,
      unit: '%',
      trend: 'stable',
      trendValue: 0,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-purple-400'
    },
    {
      label: 'Active Conversations',
      value: 1243,
      trend: 'up',
      trendValue: 12,
      icon: <Activity className="h-5 w-5" />,
      color: 'text-orange-400'
    }
  ];

  const displayMetrics = metrics || defaultMetrics;

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {displayMetrics.map((metric, index) => (
          <Card key={index} className="border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`${metric.color}`}>
                    {metric.icon}
                  </div>
                  {metric.trend && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        metric.trend === 'up'
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : metric.trend === 'down'
                          ? 'bg-red-500/10 border-red-500/30 text-red-400'
                          : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      }`}
                    >
                      {metric.trend === 'up' && (
                        <>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{metric.trendValue}%
                        </>
                      )}
                      {metric.trend === 'down' && (
                        <>
                          <TrendingDown className="h-3 w-3 mr-1" />
                          -{metric.trendValue}%
                        </>
                      )}
                      {metric.trend === 'stable' && 'مستقر'}
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{metric.value}</span>
                    {metric.unit && <span className="text-muted-foreground">{metric.unit}</span>}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${
                      metric.color.includes('green')
                        ? 'from-green-500 to-green-400'
                        : metric.color.includes('blue')
                        ? 'from-blue-500 to-blue-400'
                        : metric.color.includes('purple')
                        ? 'from-purple-500 to-purple-400'
                        : 'from-orange-500 to-orange-400'
                    }`}
                    style={{
                      width: `${typeof metric.value === 'number' && metric.unit === '%' ? metric.value : 75}%`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Activity Feed */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg">النشاط المباشر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: 'منذ 2 دقيقة', event: 'تحليل جديد: المشاعر العالمية', region: 'عالمي' },
              { time: 'منذ 5 دقائق', event: 'ارتفاع في مؤشر الأمل', region: 'الشرق الأوسط' },
              { time: 'منذ 8 دقائق', event: 'تحديث البيانات الإقليمية', region: 'أوروبا' },
              { time: 'منذ 12 دقيقة', event: 'اكتشاف اتجاه جديد', region: 'آسيا' },
            ].map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 flex items-start justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.event}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.region}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
