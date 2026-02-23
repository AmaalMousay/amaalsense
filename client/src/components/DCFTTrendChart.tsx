import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendDataPoint {
  timestamp: string;
  gmi: number;
  cfi: number;
  hri: number;
}

interface DCFTTrendChartProps {
  data: TrendDataPoint[];
  title?: string;
  timeRange?: '24h' | '7d' | '30d' | '90d';
}

export function DCFTTrendChart({ 
  data, 
  title = 'DCFT Indicators Trend', 
  timeRange = '7d' 
}: DCFTTrendChartProps) {
  const timeRangeLabels = {
    '24h': 'آخر 24 ساعة',
    '7d': 'آخر 7 أيام',
    '30d': 'آخر 30 يوم',
    '90d': 'آخر 90 يوم',
  };

  // Calculate statistics
  const stats = {
    gmi: {
      current: data[data.length - 1]?.gmi || 0,
      average: (data.reduce((sum, d) => sum + d.gmi, 0) / data.length).toFixed(1),
      max: Math.max(...data.map(d => d.gmi)).toFixed(1),
      min: Math.min(...data.map(d => d.gmi)).toFixed(1),
    },
    cfi: {
      current: data[data.length - 1]?.cfi || 0,
      average: (data.reduce((sum, d) => sum + d.cfi, 0) / data.length).toFixed(1),
      max: Math.max(...data.map(d => d.cfi)).toFixed(1),
      min: Math.min(...data.map(d => d.cfi)).toFixed(1),
    },
    hri: {
      current: data[data.length - 1]?.hri || 0,
      average: (data.reduce((sum, d) => sum + d.hri, 0) / data.length).toFixed(1),
      max: Math.max(...data.map(d => d.hri)).toFixed(1),
      min: Math.min(...data.map(d => d.hri)).toFixed(1),
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2">
            {Object.entries(timeRangeLabels).map(([key, label]) => (
              <button
                key={key}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  timeRange === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fontSize: 12 }}
                label={{ value: 'Score (0-100)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(label) => `الوقت: ${label}`}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => {
                  const labels = {
                    gmi: 'مؤشر المزاج العام (GMI)',
                    cfi: 'مؤشر المشاعر الجماعية (CFI)',
                    hri: 'مؤشر صمود الإنسان (HRI)',
                  };
                  return labels[value as keyof typeof labels] || value;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="gmi" 
                stroke="#3B82F6" 
                dot={false}
                strokeWidth={2}
                name="gmi"
              />
              <Line 
                type="monotone" 
                dataKey="cfi" 
                stroke="#A855F7" 
                dot={false}
                strokeWidth={2}
                name="cfi"
              />
              <Line 
                type="monotone" 
                dataKey="hri" 
                stroke="#10B981" 
                dot={false}
                strokeWidth={2}
                name="hri"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* GMI Stats */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">مؤشر المزاج العام</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">الحالي:</span>
                <span className="font-semibold">{stats.gmi.current.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المتوسط:</span>
                <span className="font-semibold">{stats.gmi.average}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الأقصى:</span>
                <span className="font-semibold text-green-600">{stats.gmi.max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الأدنى:</span>
                <span className="font-semibold text-red-600">{stats.gmi.min}</span>
              </div>
            </div>
          </div>

          {/* CFI Stats */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">مؤشر المشاعر الجماعية</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">الحالي:</span>
                <span className="font-semibold">{stats.cfi.current.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المتوسط:</span>
                <span className="font-semibold">{stats.cfi.average}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الأقصى:</span>
                <span className="font-semibold text-green-600">{stats.cfi.max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الأدنى:</span>
                <span className="font-semibold text-red-600">{stats.cfi.min}</span>
              </div>
            </div>
          </div>

          {/* HRI Stats */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">مؤشر صمود الإنسان</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">الحالي:</span>
                <span className="font-semibold">{stats.hri.current.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المتوسط:</span>
                <span className="font-semibold">{stats.hri.average}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الأقصى:</span>
                <span className="font-semibold text-green-600">{stats.hri.max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الأدنى:</span>
                <span className="font-semibold text-red-600">{stats.hri.min}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
