import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DCFTMetricsCard } from '@/components/DCFTMetricsCard';
import { DCFTTrendChart } from '@/components/DCFTTrendChart';
import { DCFTRegionalBreakdown } from '@/components/DCFTRegionalBreakdown';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Share2 } from 'lucide-react';
import { DCFTResultsDisplay } from '@/components/DCFTResultsDisplay';
import { TemporalComparison } from '@/components/TemporalComparison';

export function DCFTPage() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - في الواقع ستأتي من API
  const currentMetrics = {
    gmi: 72.5,
    cfi: 68.3,
    hri: 75.8,
    timestamp: new Date(),
  };

  const trendData = [
    { timestamp: '2026-02-17', gmi: 68.2, cfi: 65.1, hri: 72.3 },
    { timestamp: '2026-02-18', gmi: 69.5, cfi: 66.4, hri: 73.1 },
    { timestamp: '2026-02-19', gmi: 70.1, cfi: 67.2, hri: 74.0 },
    { timestamp: '2026-02-20', gmi: 71.3, cfi: 67.8, hri: 74.5 },
    { timestamp: '2026-02-21', gmi: 71.8, cfi: 68.1, hri: 75.2 },
    { timestamp: '2026-02-22', gmi: 72.2, cfi: 68.2, hri: 75.5 },
    { timestamp: '2026-02-23', gmi: 72.5, cfi: 68.3, hri: 75.8 },
  ];

  const regionalData = [
    { region: 'الشرق الأوسط', gmi: 75.2, cfi: 70.1, hri: 78.3, population: 400000000, trend: 5.2 },
    { region: 'آسيا', gmi: 71.8, cfi: 68.5, hri: 74.2, population: 4600000000, trend: 3.1 },
    { region: 'أوروبا', gmi: 68.5, cfi: 65.2, hri: 71.5, population: 750000000, trend: -1.2 },
    { region: 'أفريقيا', gmi: 73.1, cfi: 69.8, hri: 76.1, population: 1400000000, trend: 4.5 },
    { region: 'الأمريكتان', gmi: 70.2, cfi: 67.1, hri: 72.8, population: 1000000000, trend: 2.3 },
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    // محاكاة جلب البيانات
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleDownload = () => {
    // تحميل التقرير
    alert('جاري تحميل التقرير...');
  };

  const handleShare = () => {
    // مشاركة النتائج
    alert('جاري مشاركة النتائج...');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">محرك تحليل المشاعر الجماعية</h1>
          <p className="text-gray-600 mt-1">Digital Collective Feeling Theory (DCFT) Engine</p>
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
          <Button onClick={handleDownload} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            تحميل
          </Button>
          <Button onClick={handleShare} variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            مشاركة
          </Button>
        </div>
      </div>

      {/* Current Metrics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">المؤشرات الحالية</h2>
        <DCFTMetricsCard
          gmi={currentMetrics.gmi}
          cfi={currentMetrics.cfi}
          hri={currentMetrics.hri}
          timestamp={currentMetrics.timestamp}
        />
      </div>

      {/* Trend Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-4">الاتجاهات والتنبؤات</h2>
        <DCFTTrendChart
          data={trendData}
          title="اتجاهات المؤشرات عبر الزمن"
          timeRange={timeRange}
        />
      </div>

      {/* Regional Breakdown */}
      <div>
        <h2 className="text-xl font-semibold mb-4">التحليل الإقليمي</h2>
        <DCFTRegionalBreakdown
          data={regionalData}
          title="توزيع المؤشرات حسب المنطقة الجغرافية"
        />
      </div>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>💡 الرؤى والتوصيات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">✅ النقاط الإيجابية</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• مؤشر المزاج العام في ارتفاع مستمر (+5.2% في الأسبوع)</li>
                <li>• صمود الإنسان يتحسن في معظم المناطق</li>
                <li>• المشاعر الجماعية تتجه نحو الاستقرار</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ نقاط تحتاج انتباه</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• أوروبا تسجل أقل مؤشرات (-1.2% اتجاه سلبي)</li>
                <li>• بعض المناطق تحتاج دعم نفسي إضافي</li>
                <li>• التقلبات العاطفية تزداد في بعض القطاعات</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 التوصيات</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. تعزيز المبادرات الإيجابية في المناطق ذات المؤشرات العالية</li>
              <li>2. توفير الدعم النفسي والاجتماعي للمناطق التي تحتاج</li>
              <li>3. مراقبة التطورات في أوروبا بشكل أكثر دقة</li>
              <li>4. تعزيز التواصل والتفاهم بين المجتمعات المختلفة</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* DCFT Results Display */}
      <DCFTResultsDisplay 
        metrics={{
          gmi: currentMetrics.gmi,
          cfi: currentMetrics.cfi,
          hri: currentMetrics.hri,
          timestamp: new Date(),
          trend: currentMetrics.gmi > 50 ? 'up' as const : currentMetrics.gmi < 50 ? 'down' as const : 'stable' as const
        }}
        isLoading={isLoading}
      />

      {/* Temporal Comparison */}
      <TemporalComparison 
        data={trendData.map(d => ({
          timestamp: typeof d.timestamp === 'string' ? new Date(d.timestamp).getTime() : d.timestamp,
          gmi: d.gmi,
          cfi: d.cfi,
          hri: d.hri
        }))}
      />

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 border-t pt-4">
        <p>آخر تحديث: {new Date().toLocaleString('ar-SA')}</p>
        <p>البيانات مأخوذة من آلاف المصادر الرقمية حول العالم</p>
      </div>
    </div>
  );
}
