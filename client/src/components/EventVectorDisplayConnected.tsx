// @ts-nocheck
/**
 * EVENT VECTOR DISPLAY - CONNECTED VERSION
 * 
 * يعرض متجهات الأحداث مع بيانات حقيقية من الخادم
 * - يستخدم analysisDataRouter.getEventVectors للحصول على البيانات
 * - يعرض الأحداث الرئيسية والعلاقات بينها
 * - يدعم تحليل تأثير الأحداث
 */

import React, { useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, Network } from 'lucide-react';

interface EventVector {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  impact: number;
  reach: number;
  sentiment: number;
  category: string;
  relatedEvents: string[];
  emotionalShift: Record<string, number>;
  sources: string[];
  confidence: number;
}

interface EventVectorDisplayConnectedProps {
  topic: string;
  country?: string;
  limit?: number;
  onEventSelect?: (event: EventVector) => void;
}

export function EventVectorDisplayConnected({
  topic,
  country,
  limit = 20,
  onEventSelect
}: EventVectorDisplayConnectedProps) {
  const [selectedEvent, setSelectedEvent] = React.useState<EventVector | null>(null);
  const [sortBy, setSortBy] = React.useState<'impact' | 'reach' | 'sentiment'>('impact');

  // Fetch event vectors from backend
  const { data: eventsData, isLoading, error } = trpc.analysisData.getEventVectors.useQuery({
    topic,
    country,
    limit
  });

  const events = useMemo(() => eventsData?.data || [], [eventsData]);

  const sortedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      if (sortBy === 'impact') return b.impact - a.impact;
      if (sortBy === 'reach') return b.reach - a.reach;
      return b.sentiment - a.sentiment;
    });
    return sorted;
  }, [events, sortBy]);

  const handleEventClick = (event: EventVector) => {
    setSelectedEvent(event);
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 80) return '#000000';
    if (impact >= 60) return '#333333';
    if (impact >= 40) return '#666666';
    if (impact >= 20) return '#999999';
    return '#CCCCCC';
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment >= 70) return 'إيجابي';
    if (sentiment >= 40) return 'محايد';
    return 'سلبي';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      political: 'سياسي',
      economic: 'اقتصادي',
      social: 'اجتماعي',
      cultural: 'ثقافي',
      environmental: 'بيئي',
      health: 'صحي',
      security: 'أمني',
      technology: 'تكنولوجي'
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <Card className="w-full p-8 bg-white border border-gray-200">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          <span className="text-gray-600">جاري تحميل متجهات الأحداث...</span>
        </div>
      </Card>
    );
  }

  if (error || !events.length) {
    return (
      <Card className="w-full p-8 bg-white border border-red-200">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>خطأ في تحميل متجهات الأحداث</span>
        </div>
      </Card>
    );
  }

  const avgImpact = (events.reduce((sum, e) => sum + e.impact, 0) / events.length).toFixed(1);
  const avgReach = (events.reduce((sum, e) => sum + e.reach, 0) / events.length).toFixed(1);

  return (
    <div className="w-full space-y-4">
      {/* Events Overview */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-5 h-5 text-gray-900" />
          <h3 className="text-lg font-bold text-gray-900">متجهات الأحداث</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">عدد الأحداث</p>
            <p className="text-3xl font-bold text-gray-900">{events.length}</p>
            <p className="text-xs text-gray-500 mt-1">حدث مهم</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">متوسط التأثير</p>
            <p className="text-3xl font-bold text-gray-900">{avgImpact}</p>
            <p className="text-xs text-gray-500 mt-1">درجة التأثير</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">متوسط الوصول</p>
            <p className="text-3xl font-bold text-gray-900">{avgReach}</p>
            <p className="text-xs text-gray-500 mt-1">درجة الوصول</p>
          </div>
        </div>
      </Card>

      {/* Sort Controls */}
      <Card className="w-full p-4 bg-white border border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('impact')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'impact'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            ترتيب حسب التأثير
          </button>
          <button
            onClick={() => setSortBy('reach')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'reach'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            ترتيب حسب الوصول
          </button>
          <button
            onClick={() => setSortBy('sentiment')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'sentiment'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            ترتيب حسب المشاعر
          </button>
        </div>
      </Card>

      {/* Events List */}
      <Card className="w-full p-6 bg-white border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">الأحداث الرئيسية</h4>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedEvents.map((event, index) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                selectedEvent?.id === event.id
                  ? 'bg-gray-900 text-white border-gray-600'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{event.title}</p>
                  <p className={`text-xs ${selectedEvent?.id === event.id ? 'text-gray-300' : 'text-gray-600'}`}>
                    {getCategoryLabel(event.category)} • {new Date(event.timestamp).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-semibold ${selectedEvent?.id === event.id ? 'text-gray-300' : 'text-gray-600'}`}>
                    الموثوقية: {event.confidence.toFixed(0)}%
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2 bg-gray-50 rounded text-center">
                  <p className="text-xs text-gray-600 mb-1">التأثير</p>
                  <p className="font-bold text-sm text-gray-900">{event.impact.toFixed(0)}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded text-center">
                  <p className="text-xs text-gray-600 mb-1">الوصول</p>
                  <p className="font-bold text-sm text-gray-900">{event.reach.toFixed(0)}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded text-center">
                  <p className="text-xs text-gray-600 mb-1">المشاعر</p>
                  <p className="font-bold text-sm text-gray-900">{event.sentiment.toFixed(0)}</p>
                </div>
              </div>

              {/* Impact Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded h-2">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${event.impact}%`,
                      backgroundColor: getImpactColor(event.impact)
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-10 text-right">
                  {event.impact.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Selected Event Details */}
      {selectedEvent && (
        <Card className="w-full p-6 bg-white border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">تفاصيل الحدث</h4>

          <div className="mb-6">
            <h5 className="font-semibold text-gray-900 mb-2">{selectedEvent.title}</h5>
            <p className="text-sm text-gray-600 mb-4">{selectedEvent.description}</p>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">التأثير</p>
                <p className="text-2xl font-bold text-gray-900">{selectedEvent.impact.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">الوصول</p>
                <p className="text-2xl font-bold text-gray-900">{selectedEvent.reach.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">المشاعر</p>
                <p className="text-2xl font-bold text-gray-900">{selectedEvent.sentiment.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">الموثوقية</p>
                <p className="text-2xl font-bold text-gray-900">{selectedEvent.confidence.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          {/* Emotional Shift */}
          {Object.keys(selectedEvent.emotionalShift).length > 0 && (
            <div className="mb-6">
              <h5 className="font-semibold text-gray-900 mb-3">التحول العاطفي</h5>
              <div className="space-y-2">
                {Object.entries(selectedEvent.emotionalShift).map(([emotion, shift]) => (
                  <div key={emotion} className="flex items-center gap-3">
                    <span className="w-20 text-sm text-gray-600 capitalize">{emotion}</span>
                    <div className="flex-1 bg-gray-200 rounded h-2">
                      <div
                        className="h-full rounded transition-all"
                        style={{
                          width: `${Math.abs(shift)}%`,
                          backgroundColor: shift > 0 ? '#000000' : '#999999'
                        }}
                      />
                    </div>
                    <span className="w-12 text-right text-sm font-semibold text-gray-900">
                      {shift > 0 ? '+' : ''}{shift.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Events */}
          {selectedEvent.relatedEvents.length > 0 && (
            <div>
              <h5 className="font-semibold text-gray-900 mb-2">أحداث ذات صلة</h5>
              <div className="flex flex-wrap gap-2">
                {selectedEvent.relatedEvents.map((relatedId, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-900 rounded text-xs font-semibold border border-gray-200"
                  >
                    {relatedId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
