import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Zap, Globe } from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  category: string;
  volume: number;
  trend: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  engagement: number;
  reach: number;
  influencers: number;
  keywords: string[];
  regions: string[];
  momentum: number;
  prediction: 'rising' | 'stable' | 'declining';
}

interface TopicAnalysisDisplayProps {
  topics: Topic[];
  title?: string;
}

export function TopicAnalysisDisplay({ 
  topics, 
  title = 'Topic Analysis' 
}: TopicAnalysisDisplayProps) {
  const getTrendIcon = (trend: number) => {
    if (trend > 10) return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (trend < -10) return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <Zap className="w-5 h-5 text-yellow-500" />;
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case 'rising':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'declining':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const sortedTopics = [...topics].sort((a, b) => b.volume - a.volume);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedTopics.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد موضوعات لعرضها</p>
            ) : (
              sortedTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-4 border-2 rounded-lg transition-colors ${getSentimentColor(topic.sentiment)}`}
                >
                  {/* Topic Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg">{topic.name}</h4>
                        {getTrendIcon(topic.trend)}
                        <span className={`text-sm font-bold ${topic.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {topic.trend > 0 ? '+' : ''}{topic.trend.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{topic.category}</p>
                    </div>
                    <Badge className={getPredictionColor(topic.prediction)}>
                      {topic.prediction === 'rising' ? '📈' : topic.prediction === 'declining' ? '📉' : '➡️'} {topic.prediction}
                    </Badge>
                  </div>

                  {/* Volume Indicator */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">الحجم</span>
                      <span className="text-sm font-bold">{topic.volume.toLocaleString('ar-SA')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${Math.min((topic.volume / 10000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <p className="text-xs text-gray-600">التفاعل</p>
                      <p className="text-lg font-bold text-blue-600">{topic.engagement.toFixed(0)}</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <p className="text-xs text-gray-600">الوصول</p>
                      <p className="text-lg font-bold text-purple-600">{(topic.reach / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <p className="text-xs text-gray-600">المؤثرون</p>
                      <p className="text-lg font-bold text-green-600">{topic.influencers}</p>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-200">
                      <p className="text-xs text-gray-600">الزخم</p>
                      <p className="text-lg font-bold text-orange-600">{topic.momentum.toFixed(0)}</p>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">الكلمات المفتاحية:</p>
                    <div className="flex flex-wrap gap-2">
                      {topic.keywords.slice(0, 5).map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {topic.keywords.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{topic.keywords.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Regions */}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">المناطق الجغرافية:</p>
                    <div className="flex flex-wrap gap-1">
                      {topic.regions.map((region, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 إحصائيات الموضوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-gray-600">إجمالي الموضوعات</p>
                <p className="text-2xl font-bold text-blue-600">{topics.length}</p>
              </div>
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <p className="text-xs text-gray-600">موضوعات صاعدة</p>
                <p className="text-2xl font-bold text-green-600">
                  {topics.filter(t => t.prediction === 'rising').length}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded border border-red-200">
                <p className="text-xs text-gray-600">موضوعات هابطة</p>
                <p className="text-2xl font-bold text-red-600">
                  {topics.filter(t => t.prediction === 'declining').length}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded border border-orange-200">
                <p className="text-xs text-gray-600">متوسط الزخم</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(topics.reduce((sum, t) => sum + t.momentum, 0) / topics.length).toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
