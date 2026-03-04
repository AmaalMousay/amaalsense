/**
 * Updated Results Page - صفحة النتائج المحدثة
 * تتضمن:
 * - استقبال props من SmartAnalysis
 * - ربط جميع المكونات ببيانات حقيقية
 * - إضافة loading states
 * - إضافة error handling
 */

import React, { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAnalysisData } from '@/hooks/useAnalysisData';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { useCache } from '@/hooks/useCache';

// استيراد المكونات
import EmotionalToneAdapter from '@/components/EmotionalToneAdapter';
import SuggestionCards from '@/components/SuggestionCards';
import ConfidenceIndicator from '@/components/ConfidenceIndicator';
import SmartAnalysis from '@/components/SmartAnalysis';

interface ResultsPageProps {
  topic?: string;
  analysisData?: any;
}

/**
 * صفحة النتائج المحدثة
 */
export default function ResultsPageUpdated({ topic: propTopic }: ResultsPageProps) {
  const { topic: paramTopic } = useParams();
  const topic = propTopic || paramTopic || '';

  // حالات التحميل والخطأ
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // جلب البيانات من الـ API
  const { data: analysisData, isLoading: dataLoading, error: dataError } = useAnalysisData(topic);

  // التحديثات الفورية
  const realtimeData = useRealtimeUpdates(topic, 30000); // تحديث كل 30 ثانية

  // التخزين المؤقت
  const { getCachedData, setCachedData } = useCache();

  // معالجة البيانات
  useEffect(() => {
    if (dataLoading) {
      setIsLoading(true);
    } else if (dataError) {
      setError(dataError.message);
      setIsLoading(false);
    } else if (analysisData) {
      setCachedData(`analysis_${topic}`, analysisData);
      setError(null);
      setIsLoading(false);
    }
  }, [analysisData, dataLoading, dataError, topic, setCachedData]);

  // معالجة إعادة المحاولة
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setError(null);
  };

  // البيانات النهائية (من التخزين المؤقت أو البيانات الحقيقية)
  const finalData = analysisData || getCachedData(`analysis_${topic}`);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (!finalData) {
    return <NoDataState topic={topic} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* رأس الصفحة */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">{topic}</h1>
          <p className="text-slate-400">
            تحليل شامل للعواطف والاتجاهات العالمية
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="outline" className="bg-slate-700 text-white border-slate-600">
              {new Date(finalData.timestamp).toLocaleDateString('ar-SA')}
            </Badge>
            <Badge variant="outline" className="bg-slate-700 text-white border-slate-600">
              ثقة: {finalData.overallConfidence}%
            </Badge>
          </div>
        </div>

        {/* الشعور العام */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">الشعور العام</CardTitle>
            <CardDescription>تحليل المشاعر الإجمالية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* مؤشر الشعور */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-2">الشعور الإجمالي</div>
                <div className="text-3xl font-bold text-white">
                  {finalData.overallSentiment > 0 ? '+' : ''}{finalData.overallSentiment.toFixed(1)}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {finalData.overallSentiment > 0 ? '👍 إيجابي' : '👎 سلبي'}
                </div>
              </div>

              {/* مؤشر الثقة */}
              <ConfidenceIndicator
                confidence={finalData.overallConfidence}
                label="مستوى الثقة"
              />

              {/* حالة العاطفة */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-sm text-slate-400 mb-2">الحالة العاطفية</div>
                <div className="text-lg font-semibold text-white">
                  {finalData.emotionalState?.dominant || 'محايد'}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  الشدة: {finalData.emotionalState?.intensity || 0}/10
                </div>
              </div>
            </div>

            {/* محول النبرة العاطفية */}
            <EmotionalToneAdapter
              emotions={finalData.emotions || []}
              sentiment={finalData.overallSentiment}
            />
          </CardContent>
        </Card>

        {/* البيانات الجغرافية */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">التوزيع الجغرافي</CardTitle>
            <CardDescription>توزيع المشاعر حسب المناطق</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {finalData.regionalBreakdown?.map((region: any) => (
                <div key={region.region} className="bg-slate-700 p-4 rounded-lg">
                  <div className="font-semibold text-white mb-2">{region.region}</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {region.sentiment.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {region.trendDirection === 'increasing' && (
                      <span className="text-green-400">📈 تصاعدي</span>
                    )}
                    {region.trendDirection === 'decreasing' && (
                      <span className="text-red-400">📉 تنازلي</span>
                    )}
                    {region.trendDirection === 'stable' && (
                      <span className="text-yellow-400">➡️ مستقر</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* الاتجاهات الزمنية */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">الاتجاهات الزمنية</CardTitle>
            <CardDescription>تطور المشاعر عبر الوقت</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-slate-400 mb-2">اتجاه الاتجاه</div>
                  <div className="text-lg font-semibold text-white">
                    {finalData.trendDirection === 'increasing' && '📈 تصاعدي'}
                    {finalData.trendDirection === 'decreasing' && '📉 تنازلي'}
                    {finalData.trendDirection === 'stable' && '➡️ مستقر'}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-400 mb-2">الزخم</div>
                  <div className="text-lg font-semibold text-white">
                    {(finalData.trendMomentum * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* رسم بياني للاتجاهات */}
              <div className="bg-slate-700 p-4 rounded-lg h-64">
                <div className="text-sm text-slate-400 mb-4">آخر 24 ساعة</div>
                <div className="flex items-end gap-1 h-48">
                  {finalData.temporalTrends?.slice(-24).map((trend: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t"
                      style={{
                        height: `${((trend.sentiment + 100) / 200) * 100}%`,
                        opacity: 0.7 + (idx / 24) * 0.3
                      }}
                      title={`${trend.sentiment.toFixed(1)}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* الأحداث ذات الصلة */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">الأحداث ذات الصلة</CardTitle>
            <CardDescription>الأحداث المؤثرة على المشاعر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {finalData.relatedEvents?.map((event: any) => (
                <div key={event.id} className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-white">{event.title}</div>
                    <Badge variant="outline" className="bg-slate-600 text-white border-slate-500">
                      {event.source}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-400 mb-2">
                    {new Date(event.timestamp).toLocaleString('ar-SA')}
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-slate-500">الشعور: </span>
                      <span className="text-white font-semibold">
                        {event.sentiment.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">التأثير: </span>
                      <span className="text-white font-semibold">
                        {event.impact.toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">المصداقية: </span>
                      <span className="text-white font-semibold">
                        {event.credibility}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* التنبؤات */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">التنبؤات</CardTitle>
            <CardDescription>التنبؤات المستقبلية للمشاعر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {finalData.impactPredictions?.map((pred: any) => (
                <div key={pred.timeframe} className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-sm text-slate-400 mb-2">{pred.timeframe}</div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {pred.predictedSentiment.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400">
                    ثقة: {pred.confidence.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* التوصيات */}
        <SuggestionCards
          suggestions={finalData.recommendations || []}
          insights={finalData.keyInsights || []}
        />

        {/* تقييم المخاطر */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">تقييم المخاطر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  {finalData.riskAssessment?.level === 'critical' && '🔴'}
                  {finalData.riskAssessment?.level === 'high' && '🟠'}
                  {finalData.riskAssessment?.level === 'medium' && '🟡'}
                  {finalData.riskAssessment?.level === 'low' && '🟢'}
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">
                    {finalData.riskAssessment?.level?.toUpperCase()}
                  </div>
                  <div className="text-sm text-slate-400">مستوى الخطر</div>
                </div>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="text-sm font-semibold text-white mb-2">العوامل:</div>
                <ul className="space-y-1">
                  {finalData.riskAssessment?.factors?.map((factor: string, idx: number) => (
                    <li key={idx} className="text-sm text-slate-300">• {factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* بيانات المصادر */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">مصداقية المصادر</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {finalData.sourceCredibility?.map((source: any) => (
                <div key={source.source} className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-white">{source.source}</div>
                    <Badge variant="outline" className="bg-slate-600 text-white border-slate-500">
                      {source.type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">المصداقية: </span>
                      <span className="text-white font-semibold">{source.credibilityScore}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">الموثوقية: </span>
                      <span className="text-white font-semibold">
                        {(source.reliability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">الانحياز: </span>
                      <span className="text-white font-semibold">{source.bias.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * حالة التحميل
 */
function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 bg-slate-700" />
          <Skeleton className="h-4 w-96 bg-slate-700" />
        </div>

        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-48 bg-slate-700" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-24 bg-slate-700" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * حالة الخطأ
 */
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <Alert className="bg-red-900 border-red-700">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            <div className="font-semibold mb-2">حدث خطأ أثناء تحميل البيانات</div>
            <div className="text-sm mb-4">{error}</div>
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-sm"
            >
              إعادة محاولة
            </button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

/**
 * حالة عدم وجود بيانات
 */
function NoDataState({ topic }: { topic: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <Alert className="bg-yellow-900 border-yellow-700">
          <AlertCircle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            <div className="font-semibold mb-2">لم يتم العثور على بيانات</div>
            <div className="text-sm">
              لم نتمكن من العثور على بيانات تحليل للموضوع "{topic}". يرجى محاولة موضوع آخر.
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
