/**
 * Comparison Chart Component
 * مخطط المقارنة
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonItem {
  label: string;
  value: number;
  previousValue?: number;
}

interface ComparisonChartProps {
  title: string;
  items?: ComparisonItem[];
  maxValue?: number;
}

export function ComparisonChart({ title, items, maxValue = 100 }: ComparisonChartProps) {
  const defaultItems: ComparisonItem[] = [
    { label: 'الشرق الأوسط', value: 68, previousValue: 65 },
    { label: 'أوروبا', value: 62, previousValue: 60 },
    { label: 'آسيا', value: 70, previousValue: 68 },
    { label: 'أمريكا', value: 65, previousValue: 67 },
    { label: 'أفريقيا', value: 58, previousValue: 55 },
  ];

  const displayItems = items || defaultItems;

  return (
    <Card className="border-gray-300 bg-white">
      <CardHeader>
        <CardTitle className="text-black">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-black">{item.label}</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-black">{item.value}%</span>
                  {item.previousValue !== undefined && (
                    <span className={`text-xs ${
                      item.value > item.previousValue
                        ? 'text-green-600'
                        : item.value < item.previousValue
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      {item.value > item.previousValue ? '↑' : item.value < item.previousValue ? '↓' : '→'}
                      {Math.abs(item.value - item.previousValue)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Bar */}
              <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="mt-6 pt-4 border-t border-gray-300 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600">الأعلى</p>
            <p className="text-lg font-bold text-black">
              {Math.max(...displayItems.map(i => i.value))}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">المتوسط</p>
            <p className="text-lg font-bold text-black">
              {Math.round(displayItems.reduce((sum, i) => sum + i.value, 0) / displayItems.length)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">الأقل</p>
            <p className="text-lg font-bold text-black">
              {Math.min(...displayItems.map(i => i.value))}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
