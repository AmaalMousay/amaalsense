import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TopicAnalysisDisplay } from '@/components/TopicAnalysisDisplay';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter, TrendingUp } from 'lucide-react';

export function TopicAnalysisPage() {
  const [filterPrediction, setFilterPrediction] = useState<'all' | 'rising' | 'stable' | 'declining'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - في الواقع ستأتي من API
  const mockTopics = [
    {
      id: '1',
      name: 'الذكاء الاصطناعي والتكنولوجيا',
      category: 'تكنولوجيا',
      volume: 8500,
      trend: 25.5,
      sentiment: 'positive' as const,
      engagement: 92,
      reach: 450000,
      influencers: 127,
      keywords: ['AI', 'تعلم آلي', 'تقنية', 'ابتكار', 'مستقبل'],
      regions: ['الشرق الأوسط', 'آسيا', 'أوروبا'],
      momentum: 88,
      prediction: 'rising' as const,
    },
    {
      id: '2',
      name: 'التغير المناخي والبيئة',
      category: 'بيئة',
      volume: 6200,
      trend: 15.3,
      sentiment: 'negative' as const,
      engagement: 78,
      reach: 320000,
      influencers: 94,
      keywords: ['مناخ', 'بيئة', 'استدامة', 'انبعاثات', 'حماية'],
      regions: ['عالمي', 'أوروبا', 'أمريكا'],
      momentum: 72,
      prediction: 'rising' as const,
    },
    {
      id: '3',
      name: 'الرياضة والألعاب الأولمبية',
      category: 'رياضة',
      volume: 5800,
      trend: 8.2,
      sentiment: 'positive' as const,
      engagement: 85,
      reach: 280000,
      influencers: 156,
      keywords: ['رياضة', 'أولمبياد', 'كرة قدم', 'بطولة', 'فريق'],
      regions: ['الشرق الأوسط', 'أفريقيا', 'آسيا'],
      momentum: 65,
      prediction: 'stable' as const,
    },
    {
      id: '4',
      name: 'الاقتصاد والأسواق المالية',
      category: 'اقتصاد',
      volume: 7100,
      trend: -12.4,
      sentiment: 'neutral' as const,
      engagement: 88,
      reach: 410000,
      influencers: 203,
      keywords: ['اقتصاد', 'أسهم', 'استثمار', 'تضخم', 'نمو'],
      regions: ['عالمي', 'أوروبا', 'آسيا'],
      momentum: 58,
      prediction: 'declining' as const,
    },
    {
      id: '5',
      name: 'الصحة والعافية',
      category: 'صحة',
      volume: 4500,
      trend: 18.7,
      sentiment: 'positive' as const,
      engagement: 76,
      reach: 220000,
      influencers: 89,
      keywords: ['صحة', 'لياقة', 'عافية', 'تغذية', 'طب'],
      regions: ['الشرق الأوسط', 'أوروبا', 'أمريكا'],
      momentum: 71,
      prediction: 'rising' as const,
    },
  ];

  const filteredTopics = filterPrediction === 'all' 
    ? mockTopics 
    : mockTopics.filter(t => t.prediction === filterPrediction);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">تحليل الموضوعات</h1>
          <p className="text-gray-600 mt-1">Topic Analysis - تتبع الموضوعات الرائجة والاتجاهات العالمية</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            الفلاتر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setFilterPrediction('all')}
              variant={filterPrediction === 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              جميع الموضوعات ({mockTopics.length})
            </Button>
            <Button
              onClick={() => setFilterPrediction('rising')}
              variant={filterPrediction === 'rising' ? 'default' : 'outline'}
              className="gap-2 bg-green-50 text-green-700 hover:bg-green-100"
            >
              📈 صاعدة ({mockTopics.filter(t => t.prediction === 'rising').length})
            </Button>
            <Button
              onClick={() => setFilterPrediction('stable')}
              variant={filterPrediction === 'stable' ? 'default' : 'outline'}
              className="gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              ➡️ مستقرة ({mockTopics.filter(t => t.prediction === 'stable').length})
            </Button>
            <Button
              onClick={() => setFilterPrediction('declining')}
              variant={filterPrediction === 'declining' ? 'default' : 'outline'}
              className="gap-2 bg-red-50 text-red-700 hover:bg-red-100"
            >
              📉 هابطة ({mockTopics.filter(t => t.prediction === 'declining').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Topics Analysis */}
      <TopicAnalysisDisplay
        topics={filteredTopics}
        title={`الموضوعات المكتشفة (${filteredTopics.length})`}
      />

      {/* Top Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            أكثر الموضوعات رواجاً
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTopics
              .sort((a, b) => b.trend - a.trend)
              .slice(0, 5)
              .map((topic, idx) => (
                <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                    <div>
                      <p className="font-semibold">{topic.name}</p>
                      <p className="text-sm text-gray-600">{topic.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${topic.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {topic.trend > 0 ? '+' : ''}{topic.trend.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-600">{topic.volume.toLocaleString('ar-SA')} ذكر</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>💡 الرؤى والتوصيات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">✅ الفرص</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• موضوعات تقنية صاعدة بقوة</li>
                <li>• اهتمام متزايد بالاستدامة</li>
                <li>• فرص للمحتوى الصحي</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">⚠️ التحديات</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• تراجع في الموضوعات الاقتصادية</li>
                <li>• تنافس عالي في الرياضة</li>
                <li>• تقلبات في المشاعر العامة</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📊 الاتجاهات</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• الذكاء الاصطناعي يهيمن على النقاش</li>
                <li>• البيئة موضوع مستمر الأهمية</li>
                <li>• الصحة تحظى باهتمام متزايد</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">🎯 التوصيات</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• ركز على محتوى تقني</li>
                <li>• استثمر في الموضوعات الصحية</li>
                <li>• راقب الاقتصاد عن كثب</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t pt-4">
        <p>آخر تحديث: {new Date().toLocaleString('ar-SA')}</p>
        <p>تم تحليل {mockTopics.reduce((sum, t) => sum + t.volume, 0).toLocaleString('ar-SA')} موضوع</p>
      </div>
    </div>
  );
}
