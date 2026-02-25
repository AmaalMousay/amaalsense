/**
 * Emotion Distribution Chart Component
 * مخطط توزيع العواطف مع رسوم بيانية تفاعلية
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Smile, Frown, Angry, Meh, Zap } from 'lucide-react';

interface EmotionData {
  emotion: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  arabicName: string;
}

interface EmotionDistributionChartProps {
  emotions?: Record<string, number>;
  dominantEmotion?: string;
}

const emotionConfig: Record<string, { color: string; icon: React.ReactNode; arabicName: string }> = {
  joy: { color: 'text-yellow-400', icon: <Smile className="h-5 w-5" />, arabicName: 'فرح' },
  sadness: { color: 'text-blue-400', icon: <Frown className="h-5 w-5" />, arabicName: 'حزن' },
  anger: { color: 'text-red-400', icon: <Angry className="h-5 w-5" />, arabicName: 'غضب' },
  fear: { color: 'text-purple-400', icon: <Zap className="h-5 w-5" />, arabicName: 'خوف' },
  surprise: { color: 'text-pink-400', icon: <Heart className="h-5 w-5" />, arabicName: 'مفاجأة' },
  neutral: { color: 'text-gray-400', icon: <Meh className="h-5 w-5" />, arabicName: 'محايد' },
  hope: { color: 'text-green-400', icon: <Heart className="h-5 w-5" />, arabicName: 'أمل' },
  curiosity: { color: 'text-cyan-400', icon: <Zap className="h-5 w-5" />, arabicName: 'فضول' },
};

export function EmotionDistributionChart({ 
  emotions = {},
  dominantEmotion = 'neutral'
}: EmotionDistributionChartProps) {
  // Convert emotions object to array and sort by value
  const emotionData: EmotionData[] = Object.entries(emotions)
    .map(([emotion, value]) => ({
      emotion,
      value: value * 100, // Convert to percentage
      color: emotionConfig[emotion]?.color || 'text-gray-400',
      icon: emotionConfig[emotion]?.icon || <Meh className="h-5 w-5" />,
      arabicName: emotionConfig[emotion]?.arabicName || emotion,
    }))
    .sort((a, b) => b.value - a.value);

  // If no emotions provided, use mock data
  const displayData = emotionData.length > 0 ? emotionData : [
    { emotion: 'joy', value: 35, color: 'text-yellow-400', icon: <Smile className="h-5 w-5" />, arabicName: 'فرح' },
    { emotion: 'hope', value: 28, color: 'text-green-400', icon: <Heart className="h-5 w-5" />, arabicName: 'أمل' },
    { emotion: 'curiosity', value: 20, color: 'text-cyan-400', icon: <Zap className="h-5 w-5" />, arabicName: 'فضول' },
    { emotion: 'neutral', value: 10, color: 'text-gray-400', icon: <Meh className="h-5 w-5" />, arabicName: 'محايد' },
    { emotion: 'sadness', value: 7, color: 'text-blue-400', icon: <Frown className="h-5 w-5" />, arabicName: 'حزن' },
  ];

  const maxValue = Math.max(...displayData.map(d => d.value));

  return (
    <Card className="border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          توزيع العواطف
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dominant Emotion Display */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
          <p className="text-sm text-muted-foreground mb-2">العاطفة السائدة</p>
          <div className="flex items-center gap-3">
            <div className={`${emotionConfig[dominantEmotion]?.color || 'text-gray-400'}`}>
              {emotionConfig[dominantEmotion]?.icon || <Meh className="h-8 w-8" />}
            </div>
            <div>
              <p className="text-2xl font-bold">
                {emotionConfig[dominantEmotion]?.arabicName || dominantEmotion}
              </p>
              <p className="text-sm text-muted-foreground">
                {displayData.find(d => d.emotion === dominantEmotion)?.value.toFixed(1) || '0'}%
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="space-y-4">
          {displayData.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const isDominant = item.emotion === dominantEmotion;

            return (
              <div key={item.emotion} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={item.color}>{item.icon}</div>
                    <span className="text-sm font-semibold">{item.arabicName}</span>
                  </div>
                  <span className={`text-sm font-bold ${item.color}`}>
                    {item.value.toFixed(1)}%
                  </span>
                </div>
                <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                      isDominant
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                        : 'bg-gradient-to-r from-slate-600 to-slate-700'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pie Chart Representation (Simple circles) */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {displayData.slice(0, 5).map((item) => {
            const size = Math.max(40, (item.value / maxValue) * 80);
            
            return (
              <div
                key={item.emotion}
                className="relative group cursor-pointer"
                style={{ width: size, height: size }}
              >
                <div
                  className={`w-full h-full rounded-full ${item.color.replace('text-', 'bg-')} opacity-20 group-hover:opacity-40 transition-opacity flex items-center justify-center`}
                >
                  <div className={item.color}>
                    {item.icon}
                  </div>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  <p className="text-xs font-semibold">{item.arabicName}</p>
                  <p className="text-xs text-muted-foreground">{item.value.toFixed(1)}%</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-slate-800/50 text-center">
            <p className="text-xs text-muted-foreground">عدد العواطف المكتشفة</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{displayData.length}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50 text-center">
            <p className="text-xs text-muted-foreground">تنوع عاطفي</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {((1 - (maxValue / 100)) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
