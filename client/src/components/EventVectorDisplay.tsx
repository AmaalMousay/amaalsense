import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, Zap } from 'lucide-react';

interface EventVector {
  id: string;
  event: string;
  timestamp: Date;
  magnitude: number;
  dimensions: {
    topic: number;
    emotion: number;
    region: number;
    impact: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  sources: number;
  relatedEvents: string[];
}

interface EventVectorDisplayProps {
  vectors: EventVector[];
  title?: string;
}

export function EventVectorDisplay({ 
  vectors, 
  title = 'Event Vectors Analysis' 
}: EventVectorDisplayProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '✅';
      case 'negative':
        return '❌';
      default:
        return '⚪';
    }
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude > 80) return 'bg-red-500';
    if (magnitude > 60) return 'bg-orange-500';
    if (magnitude > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {vectors.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد أحداث لعرضها</p>
        ) : (
          vectors.map((vector) => (
            <div
              key={vector.id}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{vector.event}</h4>
                  <p className="text-sm text-gray-500">
                    {vector.timestamp.toLocaleString('ar-SA')}
                  </p>
                </div>
                <Badge className={`${getSentimentColor(vector.sentiment)}`}>
                  {getSentimentIcon(vector.sentiment)} {vector.sentiment}
                </Badge>
              </div>

              {/* Magnitude Indicator */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">الحجم (Magnitude)</span>
                  <span className="text-sm font-bold">{vector.magnitude.toFixed(1)}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getMagnitudeColor(vector.magnitude)}`}
                    style={{ width: `${vector.magnitude}%` }}
                  />
                </div>
              </div>

              {/* Dimensions Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs text-gray-600">الموضوع</p>
                  <p className="text-lg font-bold text-blue-600">{vector.dimensions.topic.toFixed(0)}</p>
                </div>
                <div className="p-2 bg-purple-50 rounded border border-purple-200">
                  <p className="text-xs text-gray-600">العاطفة</p>
                  <p className="text-lg font-bold text-purple-600">{vector.dimensions.emotion.toFixed(0)}</p>
                </div>
                <div className="p-2 bg-green-50 rounded border border-green-200">
                  <p className="text-xs text-gray-600">المنطقة</p>
                  <p className="text-lg font-bold text-green-600">{vector.dimensions.region.toFixed(0)}</p>
                </div>
                <div className="p-2 bg-orange-50 rounded border border-orange-200">
                  <p className="text-xs text-gray-600">التأثير</p>
                  <p className="text-lg font-bold text-orange-600">{vector.dimensions.impact.toFixed(0)}</p>
                </div>
              </div>

              {/* Confidence & Sources */}
              <div className="flex items-center justify-between text-sm mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${vector.confidence}%` }}
                    />
                  </div>
                  <span className="text-gray-600">الثقة: {vector.confidence.toFixed(0)}%</span>
                </div>
                <span className="text-gray-600">المصادر: {vector.sources}</span>
              </div>

              {/* Related Events */}
              {vector.relatedEvents.length > 0 && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">أحداث ذات صلة:</p>
                  <div className="flex flex-wrap gap-2">
                    {vector.relatedEvents.map((event, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Summary Statistics */}
        {vectors.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="font-semibold mb-3">إحصائيات الأحداث</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">إجمالي الأحداث</p>
                <p className="text-2xl font-bold">{vectors.length}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">متوسط الحجم</p>
                <p className="text-2xl font-bold">
                  {(vectors.reduce((sum, v) => sum + v.magnitude, 0) / vectors.length).toFixed(0)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">متوسط الثقة</p>
                <p className="text-2xl font-bold">
                  {(vectors.reduce((sum, v) => sum + v.confidence, 0) / vectors.length).toFixed(0)}%
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600">أحداث إيجابية</p>
                <p className="text-2xl font-bold text-green-600">
                  {vectors.filter(v => v.sentiment === 'positive').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
