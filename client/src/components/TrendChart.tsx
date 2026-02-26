/**
 * Trend Chart Component
 * مخطط الاتجاهات
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

interface TrendChartProps {
  title: string;
  data?: TrendDataPoint[];
  height?: number;
}

export function TrendChart({ title, data, height = 300 }: TrendChartProps) {
  const defaultData: TrendDataPoint[] = [
    { date: '1 يناير', value: 55, label: 'يناير' },
    { date: '1 فبراير', value: 62, label: 'فبراير' },
    { date: '1 مارس', value: 58, label: 'مارس' },
    { date: '1 أبريل', value: 68, label: 'أبريل' },
    { date: '1 مايو', value: 72, label: 'مايو' },
    { date: '1 يونيو', value: 65, label: 'يونيو' },
  ];

  const displayData = data || defaultData;
  const maxValue = Math.max(...displayData.map(d => d.value));
  const minValue = Math.min(...displayData.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <Card className="border-gray-300 bg-white">
      <CardHeader>
        <CardTitle className="text-black">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }} className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-600 pr-2">
            <span>{Math.round(maxValue)}</span>
            <span>{Math.round((maxValue + minValue) / 2)}</span>
            <span>{Math.round(minValue)}</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full relative border-l-2 border-b-2 border-gray-300">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 0.25, 0.5, 0.75, 1].map((_, i) => (
                <div
                  key={i}
                  className="w-full border-t border-gray-200"
                  style={{ borderStyle: i === 0 ? 'solid' : 'dashed' }}
                />
              ))}
            </div>

            {/* SVG for line and points */}
            <svg
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox={`0 0 ${displayData.length} 100`}
            >
              {/* Line */}
              <polyline
                points={displayData
                  .map((d, i) => {
                    const y = 100 - ((d.value - minValue) / range) * 100;
                    return `${i},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="black"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />

              {/* Points */}
              {displayData.map((d, i) => {
                const y = 100 - ((d.value - minValue) / range) * 100;
                return (
                  <circle
                    key={i}
                    cx={i}
                    cy={y}
                    r="3"
                    fill="black"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-600">
              {displayData.map((d, i) => (
                <span key={i} className="text-center flex-1">
                  {d.label || d.date}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend and stats */}
        <div className="mt-12 pt-4 border-t border-gray-300 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600">أعلى قيمة</p>
            <p className="text-lg font-bold text-black">{Math.round(maxValue)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">المتوسط</p>
            <p className="text-lg font-bold text-black">
              {Math.round(displayData.reduce((sum, d) => sum + d.value, 0) / displayData.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">أقل قيمة</p>
            <p className="text-lg font-bold text-black">{Math.round(minValue)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
