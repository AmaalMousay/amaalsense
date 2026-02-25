/**
 * Impact Prediction Timeline Component
 * الجدول الزمني للتنبؤ بالتأثير
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PredictionEvent {
  timestamp: Date;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  category: string;
}

interface ImpactPredictionTimelineProps {
  predictions?: PredictionEvent[];
}

export function ImpactPredictionTimeline({ 
  predictions = []
}: ImpactPredictionTimelineProps) {
  // Generate mock predictions if not provided
  const displayPredictions: PredictionEvent[] = predictions.length > 0 ? predictions : [
    {
      timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
      title: 'ارتفاع متوقع في التفاؤل',
      description: 'من المتوقع أن ترتفع مستويات التفاؤل بنسبة 8-12% خلال الـ 24 ساعة القادمة',
      impact: 'high',
      confidence: 85,
      category: 'positive'
    },
    {
      timestamp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      title: 'استقرار في المؤشرات',
      description: 'المؤشرات العالمية ستشهد استقراراً نسبياً',
      impact: 'medium',
      confidence: 72,
      category: 'neutral'
    },
    {
      timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      title: 'تحذير: قلق محتمل',
      description: 'احتمالية ارتفاع مستويات القلق في بعض المناطق',
      impact: 'medium',
      confidence: 68,
      category: 'warning'
    },
    {
      timestamp: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      title: 'تحسن متوقع في المزاج العام',
      description: 'تحسن ملحوظ في المزاج العام بنسبة 15%',
      impact: 'high',
      confidence: 78,
      category: 'positive'
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'negative':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `خلال ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
    } else if (hours > 0) {
      return `خلال ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    } else {
      return 'قريباً';
    }
  };

  return (
    <Card className="border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          التنبؤ بالتأثير - الجدول الزمني
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timeline */}
        <div className="relative space-y-6">
          {/* Vertical line */}
          <div className="absolute right-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent" />

          {displayPredictions.map((prediction, index) => {
            const isLast = index === displayPredictions.length - 1;

            return (
              <div key={index} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getImpactColor(prediction.impact)} border-2`}>
                    {getCategoryIcon(prediction.category)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{prediction.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {getRelativeTime(prediction.timestamp)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className={getImpactColor(prediction.impact)}>
                          {prediction.impact === 'high' && 'تأثير عالٍ'}
                          {prediction.impact === 'medium' && 'تأثير متوسط'}
                          {prediction.impact === 'low' && 'تأثير منخفض'}
                        </Badge>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3">
                      {prediction.description}
                    </p>

                    {/* Confidence Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">مستوى الثقة</span>
                        <span className="font-semibold">{prediction.confidence}%</span>
                      </div>
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${prediction.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {displayPredictions.filter(p => p.category === 'positive').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">توقعات إيجابية</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {displayPredictions.filter(p => p.category === 'warning').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">تحذيرات</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {(displayPredictions.reduce((sum, p) => sum + p.confidence, 0) / displayPredictions.length).toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">متوسط الثقة</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
          <p className="text-xs text-muted-foreground">
            <AlertTriangle className="inline-block h-3 w-3 ml-1" />
            التنبؤات مبنية على تحليل البيانات التاريخية والاتجاهات الحالية. النتائج الفعلية قد تختلف.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
