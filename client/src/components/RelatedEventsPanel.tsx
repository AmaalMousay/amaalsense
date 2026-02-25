/**
 * Related Events Panel Component
 * لوحة الأحداث ذات الصلة
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RelatedEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location?: string;
  relevance: number;
  category: string;
  source?: string;
  url?: string;
}

interface RelatedEventsPanelProps {
  events?: RelatedEvent[];
  onEventClick?: (eventId: string) => void;
}

export function RelatedEventsPanel({ 
  events = [],
  onEventClick
}: RelatedEventsPanelProps) {
  // Generate mock events if not provided
  const displayEvents: RelatedEvent[] = events.length > 0 ? events : [
    {
      id: '1',
      title: 'قمة المناخ العالمية 2026',
      description: 'اجتماع قادة العالم لمناقشة التغير المناخي والحلول المستدامة',
      date: new Date('2026-03-15'),
      location: 'دبي، الإمارات',
      relevance: 95,
      category: 'environment',
      source: 'UN Climate',
      url: '#'
    },
    {
      id: '2',
      title: 'إطلاق مبادرة الطاقة النظيفة',
      description: 'إعلان عن مشروع عالمي للطاقة المتجددة بقيمة 500 مليار دولار',
      date: new Date('2026-02-28'),
      location: 'عالمي',
      relevance: 88,
      category: 'economy',
      source: 'World Bank',
      url: '#'
    },
    {
      id: '3',
      title: 'مؤتمر التكنولوجيا والابتكار',
      description: 'عرض أحدث التقنيات في الذكاء الاصطناعي والروبوتات',
      date: new Date('2026-04-10'),
      location: 'سان فرانسيسكو، الولايات المتحدة',
      relevance: 82,
      category: 'tech',
      source: 'Tech Summit',
      url: '#'
    },
    {
      id: '4',
      title: 'منتدى الصحة العالمية',
      description: 'مناقشة التحديات الصحية العالمية وسبل التعاون الدولي',
      date: new Date('2026-05-20'),
      location: 'جنيف، سويسرا',
      relevance: 75,
      category: 'health',
      source: 'WHO',
      url: '#'
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environment':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'economy':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'tech':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'health':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'politics':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      environment: 'بيئة',
      economy: 'اقتصاد',
      tech: 'تكنولوجيا',
      health: 'صحة',
      politics: 'سياسة',
      sports: 'رياضة',
      education: 'تعليم'
    };
    return labels[category] || category;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-orange-500" />
          الأحداث ذات الصلة
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {displayEvents.map((event, index) => (
          <div
            key={event.id}
            className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all cursor-pointer group"
            onClick={() => onEventClick?.(event.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1 group-hover:text-orange-400 transition-colors">
                  {event.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(event.date)}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="outline" className={getCategoryColor(event.category)}>
                {getCategoryLabel(event.category)}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3">
              {event.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {event.source && (
                  <span className="text-xs text-muted-foreground">
                    المصدر: {event.source}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">الصلة:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-1.5 rounded-full ${
                          i < Math.floor(event.relevance / 20)
                            ? 'bg-orange-500'
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-orange-400 ml-1">
                    {event.relevance}%
                  </span>
                </div>
              </div>
              {event.url && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(event.url, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3 ml-1" />
                  المزيد
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Load More */}
        {displayEvents.length > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => console.log('Load more events')}
          >
            عرض المزيد من الأحداث
          </Button>
        )}

        {/* Empty State */}
        {displayEvents.length === 0 && (
          <div className="text-center py-8">
            <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              لا توجد أحداث ذات صلة في الوقت الحالي
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
