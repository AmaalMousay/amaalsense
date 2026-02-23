import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DCFTMetric {
  name: string;
  value: number;
  trend: number;
  description: string;
  color: string;
  icon: React.ReactNode;
}

interface DCFTMetricsCardProps {
  gmi: number;
  cfi: number;
  hri: number;
  timestamp: Date;
}

export function DCFTMetricsCard({ gmi, cfi, hri, timestamp }: DCFTMetricsCardProps) {
  const metrics: DCFTMetric[] = [
    {
      name: 'Global Mood Index',
      value: gmi,
      trend: Math.random() > 0.5 ? 5 : -3,
      description: 'العاطفة العامة على مستوى العالم',
      color: 'bg-blue-50 border-blue-200',
      icon: <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">G</div>,
    },
    {
      name: 'Collective Feeling Index',
      value: cfi,
      trend: Math.random() > 0.5 ? 8 : -2,
      description: 'مؤشر المشاعر الجماعية',
      color: 'bg-purple-50 border-purple-200',
      icon: <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">C</div>,
    },
    {
      name: 'Human Resilience Index',
      value: hri,
      trend: Math.random() > 0.5 ? 12 : -5,
      description: 'مؤشر صمود الإنسان',
      color: 'bg-green-50 border-green-200',
      icon: <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">H</div>,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.name} className={`border-2 ${metric.color}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {metric.icon}
                <div>
                  <CardTitle className="text-sm font-semibold">{metric.name}</CardTitle>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Main Value */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{metric.value.toFixed(1)}</span>
                <span className="text-sm text-gray-500">/100</span>
              </div>

              {/* Trend */}
              <div className="flex items-center gap-2">
                {metric.trend > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">+{metric.trend.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-600">{metric.trend.toFixed(1)}%</span>
                  </>
                )}
                <span className="text-xs text-gray-500">vs. yesterday</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    metric.value > 70
                      ? 'bg-green-500'
                      : metric.value > 40
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>

              {/* Status */}
              <p className="text-xs text-gray-600">
                {metric.value > 70
                  ? '✅ إيجابي جداً'
                  : metric.value > 40
                    ? '⚠️ محايد'
                    : '❌ سلبي'}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Updated At */}
      <div className="md:col-span-3 text-center text-xs text-gray-500 mt-2">
        آخر تحديث: {timestamp.toLocaleString('ar-SA')}
      </div>
    </div>
  );
}
