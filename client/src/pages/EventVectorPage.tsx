import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventVectorDisplay } from '@/components/EventVectorDisplay';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter, Download } from 'lucide-react';

export function EventVectorPage() {
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - في الواقع ستأتي من API
  const mockEventVectors = [
    {
      id: '1',
      event: 'اتفاق سلام إقليمي تاريخي',
      timestamp: new Date('2026-02-23'),
      magnitude: 85,
      dimensions: { topic: 90, emotion: 88, region: 82, impact: 87 },
      sentiment: 'positive' as const,
      confidence: 92,
      sources: 2847,
      relatedEvents: ['مفاوضات دولية', 'قمة إقليمية', 'بيان رسمي'],
    },
    {
      id: '2',
      event: 'أزمة اقتصادية محلية',
      timestamp: new Date('2026-02-22'),
      magnitude: 72,
      dimensions: { topic: 78, emotion: 75, region: 68, impact: 70 },
      sentiment: 'negative' as const,
      confidence: 85,
      sources: 1523,
      relatedEvents: ['تضخم أسعار', 'بطالة', 'احتجاجات'],
    },
    {
      id: '3',
      event: 'إطلاق مشروع تنموي جديد',
      timestamp: new Date('2026-02-21'),
      magnitude: 65,
      dimensions: { topic: 70, emotion: 68, region: 62, impact: 65 },
      sentiment: 'positive' as const,
      confidence: 78,
      sources: 1205,
      relatedEvents: ['استثمارات', 'فرص عمل', 'بنية تحتية'],
    },
    {
      id: '4',
      event: 'حدث رياضي عالمي',
      timestamp: new Date('2026-02-20'),
      magnitude: 58,
      dimensions: { topic: 62, emotion: 65, region: 55, impact: 52 },
      sentiment: 'neutral' as const,
      confidence: 88,
      sources: 3421,
      relatedEvents: ['منافسة دولية', 'إنجاز رياضي'],
    },
  ];

  const filteredVectors = filterSentiment === 'all' 
    ? mockEventVectors 
    : mockEventVectors.filter(v => v.sentiment === filterSentiment);

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
          <h1 className="text-3xl font-bold">نظام متجهات الأحداث</h1>
          <p className="text-gray-600 mt-1">Event Vector System - تحليل وتصنيف الأحداث العالمية</p>
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
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            تحميل
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
              onClick={() => setFilterSentiment('all')}
              variant={filterSentiment === 'all' ? 'default' : 'outline'}
              className="gap-2"
            >
              جميع الأحداث ({mockEventVectors.length})
            </Button>
            <Button
              onClick={() => setFilterSentiment('positive')}
              variant={filterSentiment === 'positive' ? 'default' : 'outline'}
              className="gap-2 bg-green-50 text-green-700 hover:bg-green-100"
            >
              ✅ إيجابية ({mockEventVectors.filter(v => v.sentiment === 'positive').length})
            </Button>
            <Button
              onClick={() => setFilterSentiment('negative')}
              variant={filterSentiment === 'negative' ? 'default' : 'outline'}
              className="gap-2 bg-red-50 text-red-700 hover:bg-red-100"
            >
              ❌ سلبية ({mockEventVectors.filter(v => v.sentiment === 'negative').length})
            </Button>
            <Button
              onClick={() => setFilterSentiment('neutral')}
              variant={filterSentiment === 'neutral' ? 'default' : 'outline'}
              className="gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              ⚪ محايدة ({mockEventVectors.filter(v => v.sentiment === 'neutral').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event Vectors */}
      <EventVectorDisplay
        vectors={filteredVectors}
        title={`الأحداث المكتشفة (${filteredVectors.length})`}
      />

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>💡 الرؤى والتحليلات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">📊 الاتجاهات الرئيسية</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• أحداث إيجابية تهيمن على المشهد (60%)</li>
                <li>• متوسط حجم الأحداث: 70/100</li>
                <li>• ثقة عالة في التصنيف (86%)</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">🔍 الأبعاد الأكثر تأثراً</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• الموضوع: 75/100 (متوسط)</li>
                <li>• العاطفة: 74/100 (متوسط)</li>
                <li>• التأثير: 69/100 (معتدل)</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">✅ النقاط الإيجابية</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• اتفاقات سلام تاريخية قيد التفاوض</li>
                <li>• مشاريع تنموية جديدة تنطلق</li>
                <li>• استقرار نسبي في المؤشرات</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">⚠️ نقاط تحتاج انتباه</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• أزمات اقتصادية محلية</li>
                <li>• تقلبات في المؤشرات الإقليمية</li>
                <li>• حاجة لمراقبة مستمرة</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 mt-4">
            <h4 className="font-semibold text-indigo-900 mb-2">🎯 التوصيات</h4>
            <ol className="text-sm text-indigo-800 space-y-1 list-decimal list-inside">
              <li>متابعة الأحداث الإيجابية وتعزيزها</li>
              <li>معالجة الأزمات الاقتصادية بسرعة</li>
              <li>زيادة التواصل والشفافية</li>
              <li>بناء الثقة المجتمعية</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t pt-4">
        <p>آخر تحديث: {new Date().toLocaleString('ar-SA')}</p>
        <p>تم تحليل {mockEventVectors.reduce((sum, v) => sum + v.sources, 0).toLocaleString()} مصدر رقمي</p>
      </div>
    </div>
  );
}
